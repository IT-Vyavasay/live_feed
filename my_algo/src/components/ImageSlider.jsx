import React, { useState } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import CustomVideoPlayer from './commonComponents/CommonVideoPlayer'

const ImageSlider = ({ images = [], description }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel)
    }
  })

  // if (!images.length) return <p>No images to display</p>

  function getFileType(url) {
    if (!url || typeof url !== 'string') return 'other'

    const extension = url.split('.').pop().toLowerCase().split(/\#|\?/)[0] // handles ?params and #hash

    const imageExt = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
    const videoExt = ['mp4', 'mov', 'avi', 'mkv', 'flv', 'webm', 'm4v']

    if (imageExt.includes(extension)) return 'image'
    if (videoExt.includes(extension)) return 'video'
    return 'other'
  }

  const FileRender = ({ url, index }) => {
    const fileType = getFileType(url)
    const commonClasses = 'w-full h-auto object-cover'

    switch (fileType) {
      case 'image':
        return <img src={url} alt={`Slide ${index}`} className={commonClasses} />

      case 'video':
        return <CustomVideoPlayer url={url} />

      case 'other':
      default:
        return (
          <div className='flex items-center justify-center w-full aspect-[2] bg-gray-200 border border-gray-300 rounded-lg shadow-sm'>
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition'
            >
              📄 View / Download File
            </a>
          </div>
        )
    }
  }

  return (
    <div className='relative'>
      {/* Slider */}
      {!images ? (
        <>
          <div className='flex items-start justify-start w-full aspect-[2] bg-gray-200 border border-gray-300 rounded-lg shadow-sm'>
            <p rel='noopener noreferrer' className='px-4 py-2 w-full text-left'>
              {description ?? 'No description available'}
            </p>
          </div>
        </>
      ) : (
        <>
          <div ref={sliderRef} className='keen-slider rounded overflow-hidden'>
            {images.map((img, index) => (
              <div key={index} className='keen-slider__slide' style={{ aspectRatio: '2' }}>
                <FileRender url={img} key={index} index={index} />
              </div>
            ))}
          </div>

          {/* Dots in bottom-right corner */}
          {images && images?.length > 1 && (
            <div className='absolute bottom-3 right-3 flex gap-2 bg-white/70 px-2 py-1 rounded shadow'>
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => slider.current?.moveToIdx(idx)}
                  className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                    currentSlide === idx ? 'bg-black' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ImageSlider
