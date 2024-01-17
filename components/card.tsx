import React from 'react'

interface CardProps {
    title: string
    image: string
    quantity: string
    features: string[]
}

const Card = (props: CardProps) => {
    return (
        <div className='space-y-6'>
            <img src={props.image} alt="" />
            <div>
                <h3 className='font-black text-[#fff1e9] text-2xl'>{props.title}</h3>
                <p className='font-black text-xl text-[#36c47d]'>{props.quantity}</p>
            </div>
            <div className='space-y-2'>
                {props.features.map((feature, index) => (
                    <p key={index} className='text-[#fff1e9] text-xl'>{feature}</p>
                ))}
            </div>
        </div>
    )
}

export default Card