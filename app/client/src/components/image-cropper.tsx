import { useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { nanoid } from 'nanoid';
import { IoMdImages } from 'react-icons/io';
import setCanvasPreview from '../services/setCanvasPreview';
import api from '../api';
import type { Area } from 'react-easy-crop';

export default function ImageCropper({
	dimension,
	username,
}: {
	dimension: number;
	username: string;
}) {
	const [imgSrc, setImgSrc] = useState('');
	const [image, setImage] = useState<HTMLImageElement | null>(null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [error, setError] = useState(false);
	const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
	const [croppedArea, setCroppedArea] = useState<Area | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	// returns max zoom level before the width or height of the cropped area
	// would drop below the dimension
	const calculateMaxZoom = useCallback(() => {
		const { width, height } = imageSize;

		if (!width || !height) return 1;

		const zoomX = width / dimension;
		const zoomY = height / dimension;

		return Math.min(zoomX, zoomY);
	}, [imageSize]);

	function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];

		if (!file) return;

		const reader = new FileReader();

		reader.addEventListener('load', () => {
			// create a new image since the image's natural dimensions need to be
			// checked to prevent ones that are too small from rendering before the
			// error message
			const image = new Image();
			const imageUrl = reader.result?.toString() || '';
			image.src = imageUrl;

			image.addEventListener('load', (e: Event) => {
				setError(false);

				const { naturalWidth, naturalHeight } =
					e.currentTarget as HTMLImageElement;

				if (naturalWidth < dimension || naturalHeight < dimension) {
					setError(true);
					return setImgSrc('');
				}

				setImageSize({ width: naturalWidth, height: naturalHeight });
			});

			setImgSrc(imageUrl);
			setImage(image);
		});

		reader.readAsDataURL(file);
	}

	return (
		<div className="min-w-[250px] w-[50vw] max-w-[600px]">
			<div className="relative w-full min-h-96 my-4 bg-slate-200 dark:bg-slate-700">
				{imgSrc.length === 0 && (
					<IoMdImages className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-slate-400 dark:text-slate-800" />
				)}

				<Cropper
					image={imgSrc}
					crop={crop}
					zoom={zoom}
					aspect={1}
					cropShape="round"
					showGrid={false}
					onCropChange={setCrop}
					onZoomChange={setZoom}
					onCropComplete={(_, croppedAreaPixels) =>
						setCroppedArea(croppedAreaPixels)
					}
					maxZoom={calculateMaxZoom()}
				/>
			</div>

			<div className="flex justify-between">
				<input
					ref={inputRef}
					type="file"
					accept="image/*"
					onChange={onFileSelect}
					className="hidden"
				/>

				<button
					onClick={() => inputRef.current?.click()}
					className="bg-slate-300 hover-bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors rounded-full py-1 px-2 lg:py-2 lg:px-4"
				>
					Browse...
				</button>

				<button
					onClick={() => {
						setCanvasPreview(
							image!,
							canvasRef.current!,
							croppedArea!,
							dimension
						);

						canvasRef.current?.toBlob(
							async (blob) => {
								if (!blob) {
									throw new Error('blob not created');
								}

								const formData = new FormData();
								formData.append(
									'avatar',
									blob,
									`${nanoid(12)}_${dimension}x${dimension}.webp`
								);

								try {
									const response = await api.post(
										`/users/${username}/avatar`,
										formData,
										// override the content type that's set to application/json in the api config
										{ headers: { 'Content-Type': 'multipart/form-data' } }
									);
									console.log(response);
								} catch (error) {
									console.log(error);
								}
							},
							'image/webp',
							1
						);
					}}
					className="max-w-fit justify-self-end bg-sky-500 hover:bg-sky-400 transition-colors rounded-full py-1 px-2 lg:py-2 lg:px-4"
				>
					Upload
				</button>
			</div>

			{imgSrc.length === 0 && (
				<p
					className={`mt-1 ${
						error ? 'text-rose-400' : 'text-slate-600 dark:text-slate-400'
					}`}
				>
					Image must be at least {dimension} x {dimension} pixels
				</p>
			)}

			{croppedArea && (
				<canvas
					ref={canvasRef}
					className="mt-4 object-contain hidden"
					style={{
						width: dimension,
						height: dimension,
					}}
				></canvas>
			)}
		</div>
	);
}
