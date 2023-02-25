import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import { getImages } from 'services/apiService';
import { ImageGallery } from './ImageGallery';
import { Notify } from 'notiflix';
import Button from './Button';
import '../index.css';
import '../styles.css';
import Loader from './Loader';
import Modal from './Modal';
//history
export function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [imageQ, setImageQ] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [totalHits, setTotalHits] = useState(0);

  const handleFormSubmit = async imageQ => {
    setIsLoading(true);
    const imagesData = await getImages(imageQ);
    setIsLoading(false);

    if (imagesData.hits.length === 0) {
      Notify.warning(
        'Unfortunately we don`t find your search query, please try something else'
      );
      return;
    }

    console.log();
    setImages(imagesData.hits);
    setImageQ(imageQ);
    setPage(1);
    setTotalHits(imagesData.totalHits);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const loadMoreHandler = async () => {
    setIsLoading(true);
    const nextPage = page + 1;
    const nextPageImages = await getImages(imageQ, nextPage);

    setImages([...images, ...nextPageImages.hits]);
    setPage(nextPage);
    setIsLoading(false);

    scrollToBottom();
  };

  const showSelectedImage = image => {
    setSelectedImage(image);
  };

  const onCloseModal = () => {
    setSelectedImage(null);
  };

  const escFunction = event => {
    if (event.key === 'Escape') {
      setSelectedImage(null);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', event => escFunction(event), false);
  }, []);

  console.log('images', images);

  const isLoadMoreVisible = images.length !== totalHits;

  return (
    <div className="App">
      <SearchBar onSubmit={handleFormSubmit}></SearchBar>
      <ImageGallery imageItems={images} onImageClick={showSelectedImage} />
      {images.length ? (
        isLoading ? (
          <Loader />
        ) : (
          <Button
            title="Load More"
            onClickHandler={loadMoreHandler}
            isLoadMoreVisible={isLoadMoreVisible}
          />
        )
      ) : null}
      <Modal selectedImage={selectedImage} onClose={onCloseModal} />
    </div>
  );
}
