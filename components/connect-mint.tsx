import dynamic from 'next/dynamic';
import React from 'react'

const WalletMultiButtonDynamic = dynamic(
    async () =>
        (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
);

const ConnectButton = () => {
    return (
        <WalletMultiButtonDynamic className='z-510' style={{
            "color": "black",
            "fontSize": "12px",
            "backgroundColor": 'transparent',
            "border": "2px solid black",
            "borderRadius": "100px",
            "width": "200px",
            "textAlign": 'center',
            "display": "flex",
            "justifyContent": "center"
        }}
        />
    )
}

export default ConnectButton