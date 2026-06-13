import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getSignedURL } from '../modules/controller';
import VideoJS from '../modules/VideoPlayer';
import videojs from 'video.js';

function WatchMovie() {
    const { id } = useParams();
    const [videoUrl, setVideoUrl] = useState(null);

    useEffect(() => {
        const fetchVideoUrl = async () => {
            const data = await getSignedURL(id);
            setVideoUrl(data.url);
        }
        fetchVideoUrl();
    }, [id])

    const playerRef = React.useRef(null);

    const videoJsOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: false,
        playbackRates: [0.5, 1, 1.5, 2],
        sources: [{
            src: videoUrl,
            type: 'video/mp4'
        }],
        controlBar: {
            fullscreenToggle: true
        },
        userActions: {
            hotkeys: true
        },
        width: window.innerWidth,
        height: window.innerHeight
    };

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        // You can handle player events here, for example:
        player.on('waiting', () => {
            videojs.log('player is waiting');
        });

        player.on('dispose', () => {
            videojs.log('player will dispose');
        });
    };

    // return (
    //     <div>
    //         {videoUrl ? (
    //             <video controls autoPlay width="1000">
    //                 <source src={videoUrl} type="video/mp4" />
    //             </video>
    //         ) : (
    //             <p>Loading movie...</p>
    //         )}
    //     </div>
    // );

    return (
        <>
            {videoUrl ? (
                <>
                    <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
                </>
            ) : (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            )}
        </>
    )
}

export default WatchMovie