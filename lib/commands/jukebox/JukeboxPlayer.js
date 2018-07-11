
import JukeboxFeature from './JukeboxFeature'

export default class JukeboxPlayer {
    constructor(library) {
        this.library = library
        this.currentSong = null
        this.songQueue = []
        this.enabledFeatures = {}
    }

    /**
     * Enable a feature.
     * @param {string} featureName - The feature's name.
     * @param {*} featureValue - Optional data attached to the feature.
     */
    enable(featureName, featureValue = true) {
        this.enabledFeatures[featureName] = featureValue
    }

    /**
     * Disable a feature.
     * @param {string} featureName - The feature's name.
     */
    disable(featureName) {
        delete this.enabledFeatures[featureName]
    }

    /**
     * Check if a feature is enabled.
     * @param {string} featureName - The feature's name.
     * @returns Whether the feature is enabled or not.
     */
    isEnabled(featureName) {
        return typeof this.enabledFeatures[featureName] !== 'undefined'
    }

    /**
     * Switch to the next song.
     * @returns A promise that resolves to the next song.
     */
    switchNextSong() {
        let nextSong = null

        if (this.isEnabled(JukeboxFeature.LOOP_SONG) && this.currentSong !== null) {
            nextSong = Promise.resolve(this.currentSong)
        } else if (this.isEnabled(JukeboxFeature.WITH_PLAYLIST)) {
            nextSong = this.library.getRandomSong({
                playlist: this.enabledFeatures[JukeboxFeature.WITH_PLAYLIST]
            })
        }

        return nextSong
            .then(song => {
                this.currentSong = song
                return song
            })
    }
}
