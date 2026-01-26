import { useState } from "react";

type CardProperties = {
    child: boolean;
}

const Card = ({ child }: CardProperties) => {
    const [count, setCount] = useState(0);
    return (
        <div className={`w-40 h-40 rounded-2xl flex justify-center items-center ${child ? 'bg-indigo-300' : 'bg-gray-100'} `}>
            <button onClick={() => setCount(count + 1)} className="bg-gray-100 px-2 py-1 rounded-2xl text-sm cursor-pointer">Card clicked { count } times</button>
        </div>
    )
}

export default Card;