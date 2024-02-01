import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useUmi } from "../../utils/useUmi";
import { useWallet } from "@solana/wallet-adapter-react";

interface INFTTrait {
    trait_type: string;
    value: string;
}

interface INFT {
    name: string;
    collectionName: string;
    tokenAddress: string;
    collectionAddress: string;
    imageUrl: string;
    traits: INFTTrait[];
    symbol: string;
    external_url: string;
}


const MintComplete = () => {
    const umi = useUmi();
    const wallet = useWallet();
    const [nfts, setNfts] = useState<INFT[]>([]); // Use the INFT interface here
    // scroll to section
    const [isLoading, setIsLoading] = useState(false);
    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Fetch NFT logic
    const fetchNFTs = () => {
        setIsLoading(true);
        console.log("fetching NFTs");
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // Comment out for now idk why it's not working
        // myHeaders.append("x-qn-api-version", "1");

        var raw = JSON.stringify({
            id: 67,
            jsonrpc: "2.0",
            method: "qn_fetchNFTs",
            params: {
                wallet: wallet.publicKey?.toString(),
                // Make parsing easier too much data returned
                omitFields: ["provenance", "chain", "creators", "description", "network"],
                page: 1,
                perPage: 40,
            },
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow" as RequestRedirect,
        };

        fetch(process.env.NEXT_PUBLIC_QUIKNODE_RPC as string, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                const assets = result.result.assets;
                // Filter only MGT assets
                // @ts-ignore
                const filteredAssets = assets.filter((asset) => asset.symbol === "MGT");
                console.log("filteredAssets: ", filteredAssets);
                setIsLoading(false);
                setNfts(filteredAssets);
            })
            .catch((error) => console.log("error", error));
    };

    // Call fetchNFTs inside useEffect
    useEffect(() => {
        console.log("wallet connected is", umi.identity.publicKey.toString());
        fetchNFTs();
    }, [wallet]);

    const text = "Check out my #MyGeoTokens mints! 🌟 \n\nCheck out the mint site and discover more @MyGeoTokens! 👇\n\n";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=https://mint.mygeotokens.com`;
    const twitterUrl2 = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=https://mint.mygeotokens.com&hashtags=OpenToAdventure`;

    return (
        <>
            <Navbar />
            <div className="bg-[#35C47D] min-h-screen flex flex-col items-center justify-center text-center space-y-8 p-8 md:p-16">
                <div>
                    <h3 className="font-black text-[#231f20] text-3xl leading-none md:text-[55px] max-w-3xl">
                        Welcome to the
                    </h3>
                    <h3 className="font-black text-[#231f20] leading-8 md:leading-normal text-3xl md:text-[55px]">
                        MyGeoTokens Collector’s Club
                    </h3>
                </div>
                {
                    !nfts ?
                        <button className="bg-black py-3 w-full font-black text-[#35C47D] rounded-full hover:bg-white hover:text-black transition-all duration-300 max-w-md"
                            onClick={() => fetchNFTs()}
                        >
                            Reveal my NFTs
                        </button> : null
                }
                {
                    nfts.length > 0 ?
                        <p className="text-xl">Your MyGeoTokens NFTs!</p>
                        :
                        null
                }
                {
                    isLoading ?
                        <div className="nft-gallery grid grid-cols-1 md:grid-cols-3 gap-4">

                            <div className="flex flex-col items-center">
                                <div className="skeleton w-80 h-96 rounded bg-gray-300 animate-pulse"></div>
                                <div className="skeleton w-64 h-4 rounded bg-gray-300 animate-pulse mt-2"></div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="skeleton w-80 h-96 rounded bg-gray-300 animate-pulse"></div>
                                <div className="skeleton w-64 h-4 rounded bg-gray-300 animate-pulse mt-2"></div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="skeleton w-80 h-96 rounded bg-gray-300 animate-pulse"></div>
                                <div className="skeleton w-64 h-4 rounded bg-gray-300 animate-pulse mt-2"></div>
                            </div>
                        </div> :
                        <div className="nft-gallery grid grid-cols-1 md:grid-cols-3 gap-4">
                            {nfts.map((nft, index) => (
                                <div key={index} className="nft-item">
                                    <img src={nft.imageUrl} alt={nft.name} width={300} height={300} className="rounded" />
                                    <p className="text-black font-medium text-lg mt-2">{nft.name}</p>
                                </div>
                            ))}
                        </div>
                }

                <p className="text-xl">What would you like to do now?</p>
                <div className="space-y-8 w-full md:max-w-md">
                    <div className="">
                        <a
                            href={twitterUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <button className="bg-black py-3 w-full font-black text-[#35C47D] rounded-full hover:bg-white hover:text-black transition-all duration-300">
                                Share my NFTs on (X) Twitter
                                {/* Share during WL mint for a $SOL rebate! */}
                            </button>
                        </a>
                        <p className="mt-2">
                            Get a $SOL rebate when you share.{" "}
                            <span
                                onClick={() => scrollTo("rebate")}
                                className="underline cursor-pointer"
                            >
                                Learn More
                            </span>
                        </p>
                    </div>
                    <div className="">
                        <Link href="/" target="_blank">
                            <button className="bg-transparent border border-black hover:bg-black hover:text-[#35C47D] py-3 w-full font-black text-black rounded-full">
                                Mint more!
                            </button>
                        </Link>
                    </div>
                    <div className="">
                        <Link href="https://discord.gg/VhrcfZ78Uj" target="_blank">
                            <button className="bg-transparent border border-black hover:bg-black hover:text-[#35C47D] py-3 w-full font-black text-black rounded-full">
                                Enter our discord
                            </button>
                        </Link>
                    </div>
                    <div className="">
                        <Link
                            href="https://mygeotokens.gitbook.io/mygeotokens"
                            target="_blank"
                        >
                            <button className="bg-transparent border border-black hover:bg-black hover:text-[#35C47D] py-3 w-full font-black text-black rounded-full">
                                Read our GitBook
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <div
                id="rebate"
                className="w-full p-4 py-8 md:p-8 bg-[#231F20] flex flex-col items-center justify-center md:space-y-8 text-center"
            >
                <p className="text-white text-xl font-bold mb-4">
                    Share your mints on X (Twitter) to receive a $SOL rebate:
                </p>
                <div className="overflow-hidden md:w-[50%]">
                    <table className="min-w-full">
                        <thead className="border">
                            <tr className="border">
                                <th className="text-sm border font-semibold text-white py-2 px-4 text-left">
                                    NFTs MINTED
                                </th>
                                <th className="text-sm border font-semibold text-white py-2 px-4 text-left">
                                    REBATE PER NFT
                                </th>
                            </tr>
                        </thead>
                        <tbody className="border text-white">
                            <tr className="border">
                                <td className="py-2 px-4 border">Whitelisted 1 - 4</td>
                                <td className="py-2 px-4 border">0.1</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border">Whitelisted 5 (Max)</td>
                                <td className="py-2 px-4 border">0.2</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mt-4">
                    <p className="text-white text-xl">
                        Jump into our #mint-rebate{" "}
                        <a href="https://discord.gg/VhrcfZ78Uj" target="_blank" rel="noreferrer" >
                            Discord channel for more info!
                        </a>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MintComplete;
