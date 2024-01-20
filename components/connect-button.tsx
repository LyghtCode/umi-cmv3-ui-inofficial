import dynamic from 'next/dynamic';
import React from 'react'

const WalletMultiButtonDynamic = dynamic(
    async () =>
        (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
);

const ConnectButton = () => {
    return (
        <WalletMultiButtonDynamic className='' style={{
            "color": "white",
            "fontSize": "12px"
        }} />
    )
}

export default ConnectButton