import './globals.css';
import './style.scss';
import HomeView from '../components/HomeView';

export default async function Page() {
	return (
		<>
			<HomeView language={'en'} />
		</>
	);
}

export const revalidate = 10;
export const dynamic = 'auto';
