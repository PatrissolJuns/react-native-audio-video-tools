import React from 'react';
import PropTypes from 'prop-types';

import toast from "../toast";
import {COLORS, ROUTES} from "../utils";
import ControlPanelItem from "../components/ControlPanelItem";

/**
 * Get details of a Media
 * @param type
 * @param runIfInputFileCorrect
 * @param mediaTools
 * @param navigate
 * @param progressModal
 * @param updateProgressModal
 * @returns {*}
 * @constructor
 */
const MediaDetailsOperation = ({type, runIfInputFileCorrect, mediaTools, navigate, progressModal, updateProgressModal}) => {
    const onMediaDetailsPressed = () => {
        runIfInputFileCorrect(() => {
            getMediaDetails();
        });
    };

    /**
     * Get details of current video
     */
    const getMediaDetails = () => {
        runIfInputFileCorrect(() => {
            updateProgressModal({
                btnText: null,
                isVisible: true,
                text: 'Executing...',
            });

            mediaTools
                .getDetails()
                .then(details => {
                    navigate(ROUTES.RESULT, {
                        content: {
                            url: '',
                            mediaType: type,
                            mediaDetails: details,
                        },
                        type: 'text'
                    });
                })
                .catch(error => toast.error(error ? error.toString() : error))
                .finally(() => updateProgressModal({isVisible: false}));
        });
    };

    return (
        <ControlPanelItem
            bgColor={COLORS["Coral Red"]}
            onPress={onMediaDetailsPressed}
            text={`${type === 'video' ? 'Video' : 'Audio'} details`}
        />
    );
};

MediaDetailsOperation.propTypes = {
    type: PropTypes.string,
    navigate: PropTypes.any,
    mediaTools: PropTypes.any,
    progressModal: PropTypes.any,
    updateProgressModal: PropTypes.any,
    runIfInputFileCorrect: PropTypes.func.isRequired,
};

export default MediaDetailsOperation;
