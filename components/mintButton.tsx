import { CandyGuard, CandyMachine, mintV2 } from "@metaplex-foundation/mpl-candy-machine";
import { GuardReturn } from "../utils/checkerHelper";
import { AddressLookupTableInput, KeypairSigner, PublicKey, Transaction, TransactionBuilder, TransactionWithMeta, Umi, createBigInt, generateSigner, none, publicKey, signAllTransactions, sol, some, transactionBuilder } from "@metaplex-foundation/umi";
import { DigitalAsset, DigitalAssetWithToken, JsonMetadata, fetchDigitalAsset, fetchJsonMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { mintText } from "../settings";
import {
    Box, Button, Flex, HStack, Heading, SimpleGrid, Text, Tooltip, UseToastOptions, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
} from "@chakra-ui/react";
import { fetchAddressLookupTable, setComputeUnitLimit, transferSol } from "@metaplex-foundation/mpl-toolbox";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { chooseGuardToUse, routeBuilder, mintArgsBuilder, combineTransactions, GuardButtonList } from "../utils/mintHelper";
import { useSolanaTime } from "@/utils/SolanaTimeContext";
import router, { useRouter } from "next/router";

const updateLoadingText = (loadingText: string | undefined, guardList: GuardReturn[], label: string, setGuardList: Dispatch<SetStateAction<GuardReturn[]>>,) => {
    const guardIndex = guardList.findIndex((g) => g.label === label);
    if (guardIndex === -1) {
        console.error("guard not found");
        return;
    }
    const newGuardList = [...guardList];
    newGuardList[guardIndex].loadingText = loadingText;
    setGuardList(newGuardList);
}

const detectBotTax = (logs: string[]) => {
    if (logs.find((l) => l.includes("Candy Guard Botting"))) {
        throw new Error(`Candy Guard Bot Tax triggered. Check transaction`);
    }
    return false;
}

const fetchNft = async (umi: Umi, nftAdress: PublicKey, toast: (options: Omit<UseToastOptions, "id">) => void) => {
    let digitalAsset: DigitalAsset | undefined;
    let jsonMetadata: JsonMetadata | undefined;
    try {
        digitalAsset = await fetchDigitalAsset(umi, nftAdress);
        jsonMetadata = await fetchJsonMetadata(umi, digitalAsset.metadata.uri)
    } catch (e) {
        console.error(e);
        toast({
            title: 'Nft could not be fetched!',
            description: "Please check your Wallet instead.",
            status: 'error',
            duration: 9000,
            isClosable: true,
        });
    }

    return { digitalAsset, jsonMetadata }
}

const mintClick = async (
    umi: Umi,
    guard: GuardReturn,
    candyMachine: CandyMachine,
    candyGuard: CandyGuard,
    ownedTokens: DigitalAssetWithToken[],
    mintAmount: number,
    toast: (options: Omit<UseToastOptions, "id">) => void,
    mintsCreated: {
        mint: PublicKey;
        offChainMetadata: JsonMetadata | undefined;
    }[] | undefined,
    setMintsCreated: Dispatch<SetStateAction<{ mint: PublicKey; offChainMetadata: JsonMetadata | undefined; }[] | undefined>>,
    guardList: GuardReturn[],
    setGuardList: Dispatch<SetStateAction<GuardReturn[]>>,
    onOpen: () => void,
    setCheckEligibility: Dispatch<SetStateAction<boolean>>
) => {
    const guardToUse = chooseGuardToUse(guard, candyGuard);
    if (!guardToUse.guards) {
        console.error("no guard defined!");
        return;
    }
    let buyBeer = true;
    if (!process.env.NEXT_PUBLIC_BUYMARKBEER) {
        buyBeer = false;
        console.log("The Creator does not want to pay for the creators beer 😒")
    }

    try {
        //find the guard by guardToUse.label and set minting to true
        const guardIndex = guardList.findIndex((g) => g.label === guardToUse.label);
        if (guardIndex === -1) {
            console.error("guard not found");
            return;
        }
        const newGuardList = [...guardList];
        newGuardList[guardIndex].minting = true;
        setGuardList(newGuardList);

        let routeBuild = await routeBuilder(umi, guardToUse, candyMachine);
        if (routeBuild) {
            toast({
                title: "Allowlist detected. Please sign to be approved to mint.",
                status: "info",
                duration: 900,
                isClosable: true,
            });
            await routeBuild.sendAndConfirm(umi, {
                confirm: { commitment: "processed" }, send: {
                    skipPreflight: true,
                },
            });
        }

        // fetch LUT
        let tables: AddressLookupTableInput[] = [];
        const lut = process.env.NEXT_PUBLIC_LUT;
        if (lut) {
            const lutPubKey = publicKey(lut);
            const fetchedLut = await fetchAddressLookupTable(umi, lutPubKey);
            tables = [fetchedLut]
        } else {
            toast({
                title: "The developer should really set a lookup table!",
                status: "error",
                duration: 90000,
                isClosable: true,
            });
        }

        const mintTxs: Transaction[] = [];
        let nftsigners = [] as KeypairSigner[];

        const latestBlockhash = (await umi.rpc.getLatestBlockhash()).blockhash;

        for (let i = 0; i < mintAmount; i++) {
            const nftMint = generateSigner(umi);
            nftsigners.push(nftMint);


            const mintArgs = mintArgsBuilder(candyMachine, guardToUse, ownedTokens)
            let tx = transactionBuilder()
                .add(mintV2(umi, {
                    candyMachine: candyMachine.publicKey,
                    collectionMint: candyMachine.collectionMint, collectionUpdateAuthority: candyMachine.authority, nftMint,
                    group: guardToUse.label === "default" ? none() : some(guardToUse.label),
                    candyGuard: candyGuard.publicKey,
                    mintArgs,
                    tokenStandard: candyMachine.tokenStandard
                }))


            if (buyBeer) {
                tx = tx.prepend(
                    transferSol(umi, {
                        destination: publicKey("9tWBFJFpyK5RGPPGbZJovLevjnKAPhwktSwom9pqMtET"),
                        amount: sol(Number(0.009)),
                    })
                );
            }
            tx.prepend(setComputeUnitLimit(umi, { units: 800_000 }));
            tx = tx.setAddressLookupTables(tables);
            tx = tx.setBlockhash(latestBlockhash);
            const transaction = tx.build(umi);
            mintTxs.push(transaction);
        }
        if (!mintTxs.length) {
            console.error("no mint tx built!");
            return;
        }

        // Try to combine route + first mint to reduce amount of transactions
        //const firstTx = mintTxs.shift() as TransactionBuilder;
        // const groupedTx = combineTransactions(umi, [routeBuild, firstTx], tables);
        // if (!groupedTx || groupedTx.length === 0) {
        //     console.error("no transaction to send");
        //     return;
        // }

        updateLoadingText(`Please sign`, guardList, guardToUse.label, setGuardList);
        const signedTransactions = await signAllTransactions(
            mintTxs.map((transaction, index) => ({
                transaction,
                signers: [umi.payer, nftsigners[index]],
            }))
        );

        let randSignature: Uint8Array;
        let amountSent = 0;

        const sendPromises = signedTransactions.map((tx, index) => {
            return umi.rpc.sendTransaction(tx)
                .then((signature) => {
                    console.log(`Transaction ${index + 1} resolved with signature: ${signature}`);
                    amountSent = amountSent + 1;
                    randSignature = signature;
                    return { status: 'fulfilled', value: signature };
                })
                .catch(error => {
                    console.error(`Transaction ${index + 1} failed:`, error);
                    return { status: 'rejected', reason: error };
                });
        });

        await Promise.allSettled(sendPromises).then(results => {
            let fulfilledCount = 0;
            let rejectedCount = 0;

            results.forEach(result => {
                if (result.status === 'fulfilled') {
                    fulfilledCount++;
                } else if (result.status === 'rejected') {
                    rejectedCount++;
                }
            });
            updateLoadingText(`Sent tx ${fulfilledCount} tx`, guardList, guardToUse.label, setGuardList);
            console.log(`Fulfilled transactions: ${fulfilledCount}`);
            console.log(`Rejected transactions: ${rejectedCount}`);
        });

        if (!(await sendPromises[0]).status === true) {
            // throw error that no tx was created
            throw new Error("no tx was created")
        }
        updateLoadingText(`finalizing transaction(s)`, guardList, guardToUse.label, setGuardList);


        //loop umi.rpc.getTransaction(lastSignature) until it does not return null. Sleep 1 second between each try.
        let transaction: TransactionWithMeta | null = null;
        for (let i = 0; i < 60; i++) {
            if (randSignature! === undefined) {
                throw new Error(`no tx on chain for signature`);
            }
            transaction = await umi.rpc.getTransaction(randSignature);
            if (transaction) {
                toast({
                    title: 'Mint successful!',
                    description: `You can find your NFTs in your wallet.`,
                    status: 'success',
                    duration: 90000,
                    isClosable: true,
                })
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        if (transaction === null) {
            throw new Error(`no tx on chain for test tx`)
        }

        const logs: string[] = transaction.meta.logs;
        detectBotTax(logs);

        updateLoadingText("Fetching your NFT", guardList, guardToUse.label, setGuardList);
        const fetchedNft = await fetchNft(umi, nftsigners[0].publicKey, toast);
        if (fetchedNft.digitalAsset && fetchedNft.jsonMetadata) {
            if (mintsCreated === undefined) {
                setMintsCreated([{ mint: nftsigners[0].publicKey, offChainMetadata: fetchedNft.jsonMetadata }]);
            }
            else {
                setMintsCreated([...mintsCreated, { mint: nftsigners[0].publicKey, offChainMetadata: fetchedNft.jsonMetadata }]);
            }
            router.push("/mint-complete");
            // onOpen();
        }
        // wait for 2 seconds and redirect
        setTimeout(() => {
            router.push("/mint-complete");
        }, 2000);
    } catch (e) {
        console.error(`minting failed because of ${e}`);

        toast({
            title: 'Your mint failed!',
            description: "Please try again.",
            status: 'error',
            duration: 9000,
            isClosable: true,
        })
    } finally {

        //find the guard by guardToUse.label and set minting to true
        const guardIndex = guardList.findIndex((g) => g.label === guardToUse.label);
        if (guardIndex === -1) {
            console.error("guard not found");
            return;
        }
        const newGuardList = [...guardList];
        newGuardList[guardIndex].minting = false;
        setGuardList(newGuardList);
        setCheckEligibility(true)
        updateLoadingText(undefined, guardList, guardToUse.label, setGuardList);
    }

};

type Props = {
    umi: Umi;
    guardList: GuardReturn[];
    candyMachine: CandyMachine | undefined;
    candyGuard: CandyGuard | undefined;
    ownedTokens: DigitalAssetWithToken[] | undefined;
    toast: (options: Omit<UseToastOptions, "id">) => void;
    setGuardList: Dispatch<SetStateAction<GuardReturn[]>>;
    mintsCreated: {
        mint: PublicKey;
        offChainMetadata: JsonMetadata | undefined;
    }[] | undefined;
    setMintsCreated: Dispatch<SetStateAction<{ mint: PublicKey; offChainMetadata: JsonMetadata | undefined; }[] | undefined>>;
    onOpen: () => void;
    setCheckEligibility: Dispatch<SetStateAction<boolean>>;
};

export function ButtonList({
    umi,
    guardList,
    candyMachine,
    candyGuard,
    ownedTokens = [], // provide default empty array
    toast,
    setGuardList,
    mintsCreated,
    setMintsCreated,
    onOpen,
    setCheckEligibility,
}: Props): JSX.Element {
    const solanaTime = useSolanaTime();
    const [numberInputValues, setNumberInputValues] = useState(1);
    const totalNumber = 2 * numberInputValues;
    const router = useRouter();
    if (!candyMachine || !candyGuard) {
        return <></>;
    }


    // remove duplicates from guardList
    //fucked up bugfix
    let filteredGuardlist = guardList.filter((elem, index, self) =>
        index === self.findIndex((t) => (
            t.label === elem.label
        ))
    )
    if (filteredGuardlist.length === 0) {
        return <></>;
    }
    // Guard "default" can only be used to mint in case no other guard exists
    if (filteredGuardlist.length > 1) {
        filteredGuardlist = guardList.filter((elem) => elem.label != "default");
    }
    let buttonGuardList = [];
    for (const guard of filteredGuardlist) {
        const text = mintText.find((elem) => elem.label === guard.label);
        // find guard by label in candyGuard
        const group = candyGuard.groups.find((elem) => elem.label === guard.label);
        let startTime = createBigInt(0);
        let endTime = createBigInt(0);
        if (group) {
            if (group.guards.startDate.__option === "Some") {
                startTime = group.guards.startDate.value.date
            }
            if (group.guards.endDate.__option === "Some") {
                endTime = group.guards.endDate.value.date
            }
        }

        let buttonElement: GuardButtonList = {
            label: guard ? guard.label : "default",
            allowed: guard.allowed,
            header: text
                ? text.header
                : "",
            buttonLabel: text
                ? text.buttonLabel
                : "Mint Now!",
            startTime,
            endTime,
            tooltip: guard.reason,
            maxAmount: guard.maxAmount
        };
        buttonGuardList.push(buttonElement);
    }
    console.log("mintsCreated ", mintsCreated)
    console.log("numberrr: ", numberInputValues)
    const notAllowedToMint = buttonGuardList.every(buttonGuard => !buttonGuard.allowed);


    return (
        <>
            {buttonGuardList.map((buttonGuard, index) => (
                <div key={index} className="flex z-10">
                    {buttonGuard.allowed ? (
                        <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:gap-16 mt-2">
                            <div>
                                <p className='text-xl md:text-2xl font-bold text-black'>
                                    Qty*
                                </p>
                                <div className="md:pb-2 flex justify-center">
                                    <NumberInput
                                        size="sm"
                                        maxW={20}
                                        defaultValue={numberInputValues}
                                        min={1}
                                        max={5}
                                        onChange={(valueString) => setNumberInputValues(parseInt(valueString))}
                                    >
                                        <NumberInputField sx={{ _focus: { boxShadow: 'none' } }} />
                                        <NumberInputStepper sx={{ border: 'none' }}>
                                            <NumberIncrementStepper sx={{ border: 'none' }} />
                                            <NumberDecrementStepper sx={{ border: 'none' }} />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </div>
                            </div>
                            <div>
                                <p className='text-xl md:text-2xl font-bold text-black'>
                                    Total
                                </p>
                                <div className='flex justify-center'>
                                    <div className='w-40 h-10 bg-[#F5F5F5] rounded-lg cursor-pointer flex justify-between items-center px-2'>
                                        <span>
                                            {totalNumber}
                                            {`SOL`}</span>
                                        <img src={"https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png"} alt='Payment Icon' className='w-6 h-6' />
                                    </div>
                                </div>

                            </div>
                            <div className="w-full flex flex-col items-center">
                                <Tooltip label={buttonGuard.tooltip} aria-label="Mint button">
                                    <Button
                                        onClick={() =>
                                            mintClick(
                                                umi,
                                                buttonGuard,
                                                candyMachine,
                                                candyGuard,
                                                ownedTokens,
                                                numberInputValues,
                                                toast,
                                                mintsCreated,
                                                setMintsCreated,
                                                guardList,
                                                setGuardList,
                                                onOpen,
                                                setCheckEligibility
                                            )
                                        }
                                        className="flex items-center justify-center w-full h-12 bg-[#e05e5c] rounded-full mt-4 md:mt-0"
                                        size="md"
                                        backgroundColor="red.300"
                                        color="white"
                                        width="300px"
                                        height={"45px"}
                                        borderRadius={50}
                                        isLoading={
                                            guardList.find((elem) => elem.label === buttonGuard.label)?.minting
                                        }
                                        loadingText={
                                            guardList.find((elem) => elem.label === buttonGuard.label)?.loadingText
                                        }
                                    >
                                        {buttonGuard.buttonLabel}
                                    </Button>
                                </Tooltip>

                            </div>
                        </div>
                    ) : (
                        null
                    )
                    }
                </div>
            ))}
            {notAllowedToMint && (
                <div className="w-full flex justify-start mt-2">
                    <button className='flex items-center justify-center w-full h-10 bg-[#e05e5c] rounded-full md:mt-0 text-white px-4 font-semibold'>
                        Public Mint 2/2 5 pm UTC!
                    </button>
                </div>
            )}
        </>

    );


}