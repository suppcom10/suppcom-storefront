import { Container } from "@medusajs/ui"
import Image from "next/image"

type ImageGalleryProps = {
  images: any[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
        {images.map((image, index) => {
          return (
            <div
              key={image.id}
              className="relative aspect-square w-full overflow-hidden bg-white"
              id={image.id}
            >
              <Image
                src={image.url}
                priority={index <= 2}
                className="absolute inset-0 rounded-none object-contain object-center"
                alt={`Product image ${index + 1}`}
                fill
                sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 40vw, 800px"
                quality={85}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery
