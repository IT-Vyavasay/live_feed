import { Pause, PlayArrow } from '@mui/icons-material'
import React, { useState, useRef } from 'react'
import ReactPlayer from 'react-player'

const CustomVideoPlayer = ({ url }) => {
  const [playing, setPlaying] = useState(false)
  const playerRef = useRef(null)

  const togglePlayPause = () => {
    setPlaying(prev => !prev)
  }

  return (
    <div className='relative w-full max-w-3xl mx-auto'>
      {/* Video Player */}
      <div className='relative pt-[56.25%]'>
        {' '}
        {/* 16:9 Aspect Ratio */}
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={playing}
          controls={false} // We'll control it ourselves
          width='100%'
          height='100%'
          className='absolute top-0 left-0'
        />
        {/* Center Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className='absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition'
        >
          {playing ? <Pause className='text-white text-5xl' /> : <PlayArrow className='text-white text-5xl' />}
        </button>
      </div>
    </div>
  )
}

export default CustomVideoPlayer
