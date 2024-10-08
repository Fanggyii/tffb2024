import Image from 'next/image';
export default async function Sponsors(props) {
	const { language, sponsors } = props;
	return (
		<div className='grid grid-cols-3 gap-10 text-center'>
			{sponsors.map((sponsor) => (
				<div className='sponsor'>
					<div className='flex mx-auto w-[80%] h-[180px] mb-10 relative'>
						<Image
							className='w-full m-auto object-contain absolute'
							src={sponsor.fields['Img']}
							alt={sponsor.fields['Title_en']}
							fill
						/>
					</div>
				</div>
			))}
		</div>
	);
}
