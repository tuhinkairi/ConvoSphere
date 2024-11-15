"use client"
import dynamic from "next/dynamic";

const VideoUi = dynamic(() => import("./VideoUi"), {ssr:false}); //ssr - server side rendering

export default function VideoCall(){
    return <VideoUi/>
}