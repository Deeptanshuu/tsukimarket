import { InfinitySpin } from 'react-loader-spinner';
import './LoadingScreen.css';

const LoadingScreen = () => {
    return (
      <div className="loading-screen">
        <InfinitySpin
          visible={true}
          width={200} // Don't put quotes around the number. worst mistake of life ever.
          color="black"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );

};

export default LoadingScreen;
