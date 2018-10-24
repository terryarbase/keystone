const resizeBase	= require('resize-base64');
const { promisify } = require('util');
const sizeOf 		= require('image-size');
const {
	existsSync,
	readFileSync,
	statSync,
} 					= require('fs');
const _forEach 		= require('lodash/forEach');
const _map 			= require('lodash/map');
const _isArray 		= require('lodash/isArray');


class Base64ImageResizer{
	/*
	** // @param: request files (default [])
	** @param: max image width size (default 600px)
	** @param: max image height size (default 1000px)
	** @param: max image file size (default 1MB)
	** @param: max number of file to be uploaded (default -1 no limit)
	** @param: output mine type of image (default jpeg type)
	*/
	constructor(options = {}) {
		const {
			maxWidth= 600,
			maxHeight= 1000,
			maxSize= 1024000,
			maxLength= -1,
			outputType= 'jpeg',
		} = options;
        this.files = [];
        this._baseFiles = [];
        this._maxWidth = maxWidth;
        this._maxSize = maxSize;
        this._maxHeight = maxHeight;
        this.resizeBase64Images = this.resizeBase64Images.bind(this);
        // this._maxNo = maxNo;
        this._prefix = `data:image/${outputType};base64, `;
        // if (maxNo !=== -1 && files.length > maxNo) {
        // 	throw new Error('Invalid Uploaded Number of Image');
        // }
    }
    set files(files) {
    	this._files = !_isArray(files) ? [files] : files;
    }
    get files() {
    	return this._baseFiles;
    }
    get file() {
    	console.log('> getter baseFiles: ', this._baseFiles);
    	return this._baseFiles[0];
    }
    /*
    ** Get standard width height of image
    ** @param1: image path
    */
    getStatWdithInfo(image) {
    	return new Promise(resolve => {
		    try {
		    	// console.log('>>>>image>>>>>', image, sizeOf);
		     //  	sizeOf(image, (err, size) => {
		     //  		console.log('>>>>>>>>>', size);
			    //     if(err) {
			    //     	throw(err);
			    //     }
			    //     resolve(size);
		    	// });
		    setTimeout(() => {
		    	console.log('> getStatWdithInfo');
		    	resolve();
		    })
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

	test() {
		new 
	}

    async collectImageInfo({ path, size: originalSize }) {
    	if (existsSync(path)) {
    		try {
	   //  		console.log('> start convert to base64 string: ', path);
				const base64 = readFileSync(path, 'base64');
				// if the file is request file stream, the size can be obtained
				const size = originalSize || statSync(path).size;
				console.log('> sizessssssss baseFiles: ', size);
				console.log('>>>>>>>>>!>>>>>>>>');
				onst info = await this.getStatWdithInfo(path);
				console.log('>>>>>>>>asdasdasdasdasfdfdf>');
				// console.log('> info baseFiles: ', info);
				// const optimize = this.getProportion(info);
				// console.log('> optimizedddd baseFiles: ', optimize);
				// const needCompress = this.isCompressedTobe(info, size);
				// console.log('> needCompress baseFiles: ', needCompress);
				// this._baseFiles = [ ...this._baseFiles, {
				// 	file, 
				//     base64: `${this._prefix}${base64}`,		// encoded base64 image string
				//    	info,									// basic image info (e.g. width, height)
				//    	size,									// original size of source image
				//     needCompress,
				//     optimize,								// optimized width and height against this.maxWidth
				// }];
			} catch (err) {
				console.log('err: ', err);
			}
			
		}
		console.log('>>>>>>>>>54fddsf');
    }
    /*
    ** Convert all of files stream to base64
    */
 //    async convertToBase64() {
	//     // read binary data
	//     if (this._files.length) {
	// 		// convert binary data to base64 encoded string
	// 		const infoTasks = _map(this._files, file => this.collectImageInfo(file));
	// 		await Promise.all(infoTasks).catch(err => console.log('> convertToBase64: ', err));
	// 	}
		
	// }

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
	async resizeBase64Images() {
		if (this._files.length) {
			// convert binary data to base64 encoded string
			const infoTasks = _map(this._files, file => this.collectImageInfo(file));
			console.log('>>>>>43434>>>>', infoTasks[0]);
			try {
				const result = await Promise.all(infoTasks);
				console.log(result);
			} catch (err) {
				console.log('>>>>>>', err);
			}
			if (this._baseFiles.length) {
		    	const { _baseFiles: baseFiles } = this;
				this._baseFiles = _map(baseFiles, file => ({
					...file,
					path: this.resizeBase64(file),
				}));
				console.log('> baseFiles: ', this._baseFiles);
			}
			console.log('>>>>>>213123123>>>');
		}
	}
}

module.exports = Base64ImageResizer;
