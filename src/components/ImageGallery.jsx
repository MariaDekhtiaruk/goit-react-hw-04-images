import ImageGalleryItem from './ImageGalleryItem';
export function ImageGallery({ imageItems, onImageClick }) {
  return (
    <>
      <ul className="ImageGallery">
        {imageItems.map(imageItem => {
          return (
            <ImageGalleryItem
              key={imageItem.id}
              imageItem={imageItem}
              onClick={onImageClick}
            />
          );
        })}
      </ul>
    </>
  );
}
