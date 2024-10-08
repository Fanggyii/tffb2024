import '../app/film.scss';
import { isEmpty } from '../utils/helpers';

export default function SpecialTitle(props) {
	const { year, title, img } = props;

	return (
		<div className='flex flex-col gap-10'>
			<div className='flex flex-col md:flex-row justify-between items-center w-full font-gaya text-h1'>
				<h2 className='font-gaya text-black text-center'>{year || 'TFFB'}</h2>
				<h2 className='font-gaya text-primary text-center'>
					{title || 'TFFB'}
				</h2>
				<h2 className='font-gaya text-black text-center'>TFFB</h2>
			</div>
			<div className='mx-auto my-10 max-w-[90%] lg:max-w-[480px]'>
				<img src={img} className='block w-full'></img>
			</div>
		</div>
	);
}
