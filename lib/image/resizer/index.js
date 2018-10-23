const gm 			= require('gm');
const resizeBase	= require('resize-base64');
const {
	existsSync,
	readFileSync,
	// statSync,
} 					= require('fs');
const _forEach 		= require('lodash/forEach');
const _map 			= require('lodash/map');
const _isArray 		= require('lodash/isArray');


class ImageResizer{
	/*
	** // @param: request files (default [])
	** @param: max image width size (default 600px)
	** @param: max image height size (default 1000px)
	** @param: max image file size (default 1MB)
	** @param: max number of file to be uploaded (default -1 no limit)
	** @param: output mine type of image
	*/
	constructor({
		maxWidth= 600,
		maxHeight= 1000,
		maxSize= 1024000,
		maxLength= -1,
		outputType= 'jpg',
	}) {
        this.files = [];
        this._baseFiles = [];
        this._maxWidth = maxWidth;
        this._maxSize = maxSize;
        this._maxHeight = maxHeight;
        this._maxNo = maxNo;

        this.convertToBase64();
        // if (maxNo !=== -1 && files.length > maxNo) {
        // 	throw new Error('Invalid Uploaded Number of Image');
        // }
    }
    set files(files) {
    	this._files = !_isArray(files) ? [files] : files;
    }
    get files() {
    	// return _map(this._baseFiles, file => file);
    }
    /*
    ** Get standard width height of image
    ** @param1: image path
    */
    getStatWdithInfo(image) {
    	return new Promise((resolve, reject) => {
		    try {
		      	gm(image).size((err, size) => {
			        if(err) {
			        	throw(err);
			        }
			        resolve(size);
		    	});
		    } catch (err) {
		      reject(err);
		    }
		});
    }
    /*
	** calculate proportion of image
	*/
	getProportion({ width,  height }) {
		if (width && height) {
			const proportion = width / height;
			if (width > height) {
				return {
					width: this._maxWidth,
					height: Math.round(this._maxWidth / proportion),
				};
			} else if (height > width) {
				return {
					width: Math.round(this._maxHeight * proportion),
					height: this._maxHeight,
				};
			} else {	// original image proportion is 1:1 
				return {
					width: this._maxWidth,
					height: this._maxWidth,
				};
			}
		}
		return {};
	}

	isCompressedTobe({ width, height }, size) {
		return width && height && size && size > this._maxSize;
	}

    async collectImageInfo(file) {
    	if (existsSync(file)) {
    		console.log('> start convert to base64 string: ', file);
			const base64 = fs.readFileSync(file, 'base64');
			const size = fs.statSync(file).size;
			const info = await this.getStatWdithInfo(file) || {};
			const optimize = this.getProportion(info);
			const needCompress = this.isCompressedTobe(info, size);
			this._baseFiles = [ ...this._baseFiles, {
			    base64,		// encoded base64 image string
			   	info,	// basic image info (e.g. width, height)
			   	size,	// original size of source image
			    file,	// original image path
			    needCompress,
			    optimize,	// optimized width and height against this.maxWidth
			}];
		}
    }
    /*
    ** Convert all of files stream to base64
    */
    async convertToBase64() {
	    // read binary data
	    if (this._files.length) {
			// convert binary data to base64 encoded string
			const infoTasks = _map(this._files, file => this.collectImageInfo(file));
			await Promise.all(infoTasks);
		}
		
	}

	resizeBase64({ optimize, base64 }) {
		if (base64 && optimize && optimize.width && optimize.height) {
			const { width, height } = optimize;
			return resizebase64(base64, width, height);
		}
		// no need to optimize
		return base64;
	}
	/*
	** resize the base64 image with optimized info
	*/
	resizeBase64Images() {
	    if (this._baseFiles.length) {
	    	const { _baseFiles: baseFiles } = this;
			this._baseFiles = _map(baseFiles, file => ({
				...file,
				base64: this.resizeBase64(file),
			}));
		}
	}
}

module.exports = ImageResizer;
