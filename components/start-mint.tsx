import {
  PublicKey,
  publicKey,
  Umi,
} from "@metaplex-foundation/umi";
import { DigitalAssetWithToken, JsonMetadata } from "@metaplex-foundation/mpl-token-metadata";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useUmi } from "../utils/useUmi";
import { fetchCandyMachine, safeFetchCandyGuard, CandyGuard, CandyMachine, AccountVersion } from "@metaplex-foundation/mpl-candy-machine"
import styles from "../styles/Home.module.css";
import { guardChecker } from "../utils/checkAllowed";
import { useToast, Text, Skeleton, useDisclosure, Button, Modal, ModalBody, ModalCloseButton, ModalContent, Image, ModalHeader, ModalOverlay, Box, Divider, VStack, Flex } from '@chakra-ui/react';
import { ButtonList } from "./mintButton";
import { GuardReturn } from "../utils/checkerHelper";
import { ShowNft } from "./showNft";
import { InitializeModal } from "./initializeModal";
import { image, headerText } from "../settings";
import { useSolanaTime } from "@/utils/SolanaTimeContext";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { useRouter } from "next/router";
import Footer from "./footer";


const useCandyMachine = (umi: Umi, candyMachineId: string, checkEligibility: boolean, setCheckEligibility: Dispatch<SetStateAction<boolean>>) => {
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();
  const [candyGuard, setCandyGuard] = useState<CandyGuard>();
  const toast = useToast();


  useEffect(() => {
    (async () => {
      if (checkEligibility) {
        if (!candyMachineId) {
          console.error("No candy machine in .env!");
          if (!toast.isActive("no-cm")) {
            toast({
              id: "no-cm",
              title: "No candy machine in .env!",
              description: "Add your candy machine address to the .env file!",
              status: "error",
              duration: 999999,
              isClosable: true,
            });
          }
          return;
        }

        let candyMachine;
        try {
          candyMachine = await fetchCandyMachine(umi, publicKey(candyMachineId));
          //verify CM Version
          if (candyMachine.version != AccountVersion.V2) {
            toast({
              id: "wrong-account-version",
              title: "Wrong candy machine account version!",
              description: "Please use latest sugar to create your candy machine. Need Account Version 2!",
              status: "error",
              duration: 999999,
              isClosable: true,
            });
            return;
          }
        } catch (e) {
          console.error(e);
          toast({
            id: "no-cm-found",
            title: "The CM from .env is invalid",
            description: "Are you using the correct environment?",
            status: "error",
            duration: 999999,
            isClosable: true,
          });
        }
        setCandyMachine(candyMachine);
        if (!candyMachine) {
          return;
        }
        let candyGuard;
        try {
          candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
        } catch (e) {
          console.error(e);
          toast({
            id: "no-guard-found",
            title: "No Candy Guard found!",
            description: "Do you have one assigned?",
            status: "error",
            duration: 999999,
            isClosable: true,
          });
        }
        if (!candyGuard) {
          return;
        }
        setCandyGuard(candyGuard);
        setCheckEligibility(false)
      }
    })();
  }, [umi, checkEligibility]);

  return { candyMachine, candyGuard };


};


export default function StartMint() {
  const router = useRouter()
  const umi = useUmi();
  const solanaTime = useSolanaTime();
  const toast = useToast();
  const { isOpen: isShowNftOpen, onOpen: onShowNftOpen, onClose: onShowNftClose } = useDisclosure();
  const [mintComplete, setMintComplete] = useState(false)
  const { isOpen: isInitializerOpen, onOpen: onInitializerOpen, onClose: onInitializerClose } = useDisclosure();
  const [mintsCreated, setMintsCreated] = useState<{ mint: PublicKey, offChainMetadata: JsonMetadata | undefined }[] | undefined>();
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [ownedTokens, setOwnedTokens] = useState<DigitalAssetWithToken[]>();
  const [guards, setGuards] = useState<GuardReturn[]>([
    { label: "startDefault", allowed: false, maxAmount: 0 },
  ]);
  const [checkEligibility, setCheckEligibility] = useState<boolean>(true);


  if (!process.env.NEXT_PUBLIC_CANDY_MACHINE_ID) {
    console.error("No candy machine in .env!")
    if (!toast.isActive('no-cm')) {
      toast({
        id: 'no-cm',
        title: 'No candy machine in .env!',
        description: "Add your candy machine address to the .env file!",
        status: 'error',
        duration: 999999,
        isClosable: true,
      })
    }
  }
  const candyMachineId: PublicKey = useMemo(() => {
    if (process.env.NEXT_PUBLIC_CANDY_MACHINE_ID) {
      return publicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID);
    } else {
      console.error(`NO CANDY MACHINE IN .env FILE DEFINED!`);
      toast({
        id: 'no-cm',
        title: 'No candy machine in .env!',
        description: "Add your candy machine address to the .env file!",
        status: 'error',
        duration: 999999,
        isClosable: true,
      })
      return publicKey("11111111111111111111111111111111");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { candyMachine, candyGuard } = useCandyMachine(umi, candyMachineId, checkEligibility, setCheckEligibility);

  useEffect(() => {
    const checkEligibility = async () => {
      if (candyMachine === undefined || !candyGuard || !checkEligibility) {
        return;
      }

      const { guardReturn, ownedTokens } = await guardChecker(
        umi, candyGuard, candyMachine, solanaTime
      );

      setOwnedTokens(ownedTokens);
      setGuards(guardReturn);
      setIsAllowed(false);

      let allowed = false;
      for (const guard of guardReturn) {
        if (guard.allowed) {
          allowed = true;
          break;
        }
      }

      setIsAllowed(allowed);
      setLoading(false);
    };

    checkEligibility();
    // On purpose: not check for candyMachine, candyGuard, solanaTime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [umi, checkEligibility]);
  console.log('candymachine authority', candyMachine?.authority)
  console.log('umi identity', umi.identity.publicKey)
  console.log('guard', candyGuard?.groups)



  return (
    <>
      <>
        <div>
          <div>
            {loading ? (
              <div>
                <Divider my="10px" />
                <Skeleton height="30px" my="10px" />
                <Skeleton height="30px" my="10px" />
                <Skeleton height="30px" my="10px" />
              </div>
            ) : (
              <ButtonList
                guardList={guards}
                candyMachine={candyMachine}
                candyGuard={candyGuard}
                umi={umi}
                ownedTokens={ownedTokens}
                toast={toast}
                setGuardList={setGuards}
                mintsCreated={mintsCreated}
                setMintsCreated={setMintsCreated}
                onOpen={onShowNftOpen}
                setCheckEligibility={setCheckEligibility}
              />
            )}
          </div>
        </div>
        <Modal isOpen={isInitializerOpen} onClose={onInitializerClose}>
          <ModalOverlay />
          <ModalContent maxW="600px">
            <ModalHeader>Initializer</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <InitializeModal umi={umi} candyMachine={candyMachine as CandyMachine} candyGuard={candyGuard} toast={toast} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </>

      <Modal isOpen={isShowNftOpen} onClose={onShowNftClose} size={"full"}>
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className="absolute w-full top-0 left-0 min-h-screen">
              <Navbar />
              <div className='bg-[#35C47D] flex flex-col items-center justify-center text-center space-y-8 p-8 md:p-16'>
                <div>
                  <h3 className='font-black text-[#231f20] text-3xl leading-none md:text-[55px] max-w-3xl'>Welcome to the
                  </h3>
                  <h3 className='font-black text-[#231f20] leading-8 md:leading-normal text-3xl md:text-[55px]'>
                    MyGeoTokens Collector’s Club
                  </h3>
                </div>
                <p className='text-xl'>Your NFTs, Revealed!</p>
                <ShowNft nfts={mintsCreated} />
                <p className='text-xl'>What would you like to do now?</p>
                <div className='space-y-8 w-full md:max-w-md'>
                  <div className=''>
                    <Link href='https://twitter.com/mygeotokens/' target='_blank'>
                      <button className='bg-black py-3 w-full font-black text-[#35C47D] rounded-full hover:bg-white hover:text-black transition-all duration-300'>Share my NFTs on (X) Twitter</button>
                    </Link>
                  </div>
                  <div className=''>
                    <Link href='/' target='_blank'>
                      <button className='bg-transparent border border-black hover:bg-black hover:text-[#35C47D] py-3 w-full font-black text-black rounded-full'>Mint more!</button>
                    </Link>
                  </div>
                  <div className=''>
                    <Link href='https://discord.gg/VhrcfZ78Uj' target='_blank'>
                      <button className='bg-transparent border border-black hover:bg-black hover:text-[#35C47D] py-3 w-full font-black text-black rounded-full'>Enter out discord</button>
                    </Link>
                  </div>
                  <div className=''>
                    <Link href='https://mygeotokens.gitbook.io/mygeotokens' target='_blank'>
                      <button className='bg-transparent border border-black hover:bg-black hover:text-[#35C47D] py-3 w-full font-black text-black rounded-full'>Read out GitBook</button>
                    </Link>
                  </div>
                </div>
              </div>
              <Footer />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>


    </>
  );
}