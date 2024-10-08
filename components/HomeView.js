'use client';

import LanguageSelect from './LanguageSelect';
import Marquee from './Marquee';
import Modal from './Modal';
import Questions from './Questions';
import SectionTitle from './SectionTitle';
import SpecialTitle from './SpecialTitle';
import Film from './Film';
import Events from './Events';
import Sponsors from './Sponsors';
import Calendar from './MyCalendar';
import Footer from './Footer';
import dropboxUrl from '../utils/dropboxUrl';
import { sectionTitles, isEmpty } from '../utils/helpers';
import dynamic from 'next/dynamic';
import RichText from './RichText';
import P5preloader from './P5preloader';

// Empty comment to test build
const airtableApiKey = process.env.AIRTABLE_API_KEY;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const airtableTableId = process.env.AIRTABLE_TABLE_FILMS_ID;
const airtableTableFilmsViewId = process.env.AIRTABLE_TABLE_FILMS_VIEW_ID;
const airtableTableFilmEventId = process.env.AIRTABLE_TABLE_FILMEVENTS_ID;
const airtableTableFilmEventViewId =
	process.env.AIRTABLE_TABLE_FILMEVENTS_VIEW_ID;
const airtableTableOthersId = process.env.AIRTABLE_TABLE_OTHERS_ID;
const airtableTableOthersViewId = process.env.AIRTABLE_TABLE_OTHERS_VIEW_ID;
const airtableTableEventsId = process.env.AIRTABLE_TABLE_EVENTS_ID;
const airtableTableEventsViewId = process.env.AIRTABLE_TABLE_EVENTS_VIEW_ID;

async function getFilmEvents() {
	try {
		const res = await fetch(
			`https://api.airtable.com/v0/${airtableBaseId}/${airtableTableFilmEventId}?view=${airtableTableFilmEventViewId}`,
			{
				headers: {
					Authorization: `Bearer ${airtableApiKey}`,
				},
				cache: 'no-store',
			}
		);
		const data = await res.json();
		return data.records;
	} catch (error) {
		return [];
	}
}

async function getFilms() {
	try {
		const res = await fetch(
			`https://api.airtable.com/v0/${airtableBaseId}/${airtableTableId}?view=${airtableTableFilmsViewId}`,
			{
				headers: {
					Authorization: `Bearer ${airtableApiKey}`,
				},
				cache: 'no-store',
			}
		);
		const data = await res.json();
		return data;
	} catch (error) {
		return [];
	}
}

async function getEvents() {
	try {
		const res = await fetch(
			`https://api.airtable.com/v0/${airtableBaseId}/${airtableTableEventsId}?view=${airtableTableEventsViewId}`,
			{
				headers: {
					Authorization: `Bearer ${airtableApiKey}`,
				},
				cache: 'no-store',
			}
		);
		const data = await res.json();
		return data.records;
	} catch (error) {
		return [];
	}
}

async function getOthers() {
	try {
		//`https://api.airtable.com/v0/${airtableBaseId}/${airtableTableOthersId}?view=${airtableTableOthersViewId}`
		const res = await fetch(
			`https://api.airtable.com/v0/${airtableBaseId}/${airtableTableOthersId}`,
			{
				headers: {
					Authorization: `Bearer ${airtableApiKey}`,
				},
				cache: 'no-store',
			}
		);
		const data = await res.json();
		return data.records;
	} catch (error) {
		return [];
	}
}

const Dynamicp5TestTwo = dynamic(() => import('./Testp5Two/Testp5Two'), {
	ssr: false,
	loading: () => <P5preloader />,
});

export default async function HomeView({ language }) {
	const otherEvents = await getEvents(); // Ensure otherEvents is an array
	let allEvents = [
		...(otherEvents?.filter((evt) => evt?.fields?.ShowInCalendar) || []), // Safeguard field access with optional chaining
	];

	let films = (await getFilms()) || {}; // Ensure films is an object
	const filmEvents = (await getFilmEvents()) || []; // Ensure filmEvents is an array

	// Safely iterate over films.records
	for (let film of films?.records || []) {
		const filmId = film?.id; // Ensure film and film.id are valid
		if (!filmId) continue; // Skip iteration if filmId is undefined

		// Safely filter filmEvents
		const eventsOfFilm = (filmEvents || []).filter(
			(event) =>
				event?.fields?.Film && // Ensure event.fields.Film exists
				event.fields.Film[0] &&
				event.fields.Film[0] === filmId
		);

		// Ensure film.fields is an object and assign 'Events'
		film.fields = film.fields || {};
		film.fields['Events'] = eventsOfFilm;

		// Add eventsOfFilm and film to allEvents
		allEvents = [...allEvents, ...eventsOfFilm, film];
	}

	const others = (await getOthers()) || []; // Ensure others is an array

	// Safeguard marquee processing
	const marquee = (
		others?.filter((data) => data?.fields?.['Type'] === 'Donate-Float') || []
	)
		.map((marquee) => marquee?.fields?.[`Title_${language}`] || '') // Handle missing fields
		.join('');

	// Safeguard sponsors processing
	const sponsors = others
		.filter((data) => data?.fields?.['Type'] === 'Sponsor')
		.map((sponsor) => {
			sponsor.fields = sponsor.fields || {}; // Ensure sponsor.fields exists
			sponsor.fields['Img'] = sponsor.fields['Img']
				? dropboxUrl(sponsor.fields['Img'])
				: 'hi';
			return sponsor;
		});

	// Safeguard partners processing
	const partners = others
		.filter((data) => data?.fields?.['Type'] === 'Partner')
		.map((partner) => {
			partner.fields = partner.fields || {}; // Ensure partner.fields exists
			partner.fields['Img'] = partner.fields['Img']
				? dropboxUrl(partner.fields['Img'])
				: 'hi';
			return partner;
		});

	// Safeguard questions processing
	const questions =
		others?.filter((data) => data?.fields?.['Type'] === 'Question') || [];

	// Safeguard websiteGlobal and ensure it exists before accessing fields
	const websiteGlobal =
		others.find((data) => data?.fields?.['Type'] === 'Website') || {};
	const websiteGlobalFields = websiteGlobal?.fields || {};

	// Safeguard heroText generation
	const heroText = websiteGlobalFields[`Title_${language}`]?.split('\n') || [];

	// Safeguard destructuring and assign default values
	const {
		VenueLink = '',
		TrailerLink = '',
		GoogleCalendarUrl = '',
	} = websiteGlobalFields;

	// Safeguard section titles and assign default values
	const sectionText = sectionTitles[language] || {};
	const {
		filmSectionTitle = '',
		aboutSectionTitle = '',
		eventSectionTitle = '',
		sponsorSectionTitle = '',
		partnerSectionTitle = '',
		questionSectionTitle = '',
	} = sectionText;

	const aboutThisYear =
		others?.filter((data) => data?.fields?.['Type'] === 'About-This-Year') ||
		[];

	return (
		<div id='content' className='relative'>
			<div className='w-full micn-h-screen flex flex-col justify-center isolate relative z-[60]'>
				<LanguageSelect />
				<div className='py-10 mix-blend text-shadow'>
					{/*<Dynamicp5TestTwo /> */}
					<h1
						className={`text-center text-h1 font-puffling text-primary ${
							language === 'tw' ? 'font-semibold' : ''
						}`}
					>
						{websiteGlobalFields[`Theme_${language}`]}
					</h1>
					{heroText &&
						heroText.map((text, i) => (
							<h1
								className={`text-center text-h1 font-puffling ${
									language === 'tw' && i === 0 ? 'font-semibold' : ''
								}`}
							>
								{text}
							</h1>
						))}
				</div>
				<div className='text-center z-50'>
					<Modal
						language={language}
						trailerUrl={TrailerLink}
						venueLink={VenueLink}
					/>
				</div>
			</div>

			<Marquee content={marquee} link={`/${language}/donate`} />

			<section className='max-w-1440 mx-auto px-[5vw]'>
				<SpecialTitle
					year={websiteGlobalFields['Year']}
					title={aboutSectionTitle}
					img='../img/banner-2024.jpg'
				/>
				<div>
					{aboutThisYear &&
						aboutThisYear.map((obj) => (
							<div key={obj.id} className='my-4'>
								<h2 className='text-center font-gaya text-h2 font-semibold mb-2'>
									{obj.fields[`Question_${language}`]}
								</h2>
								<div>
									<RichText content={obj.fields[`Answer_${language}`]} />
								</div>
							</div>
						))}
				</div>
				<SectionTitle content={filmSectionTitle}></SectionTitle>

				<div className=''>
					{films.records &&
						films.records.map(
							(film) =>
								!isEmpty(film.fields) && (
									<Film
										key={film.id}
										id={film.id}
										language={language}
										film={film.fields}
									/>
								)
						)}
				</div>

				<SectionTitle content={eventSectionTitle}></SectionTitle>
				<Events events={otherEvents} language={language} />

				<SectionTitle content={sponsorSectionTitle}></SectionTitle>
				<Sponsors language={language} sponsors={sponsors} />

				<SectionTitle content={partnerSectionTitle}></SectionTitle>
				<Sponsors language={language} sponsors={partners} />

				<SectionTitle content={questionSectionTitle}></SectionTitle>
				<Questions language={language} questions={questions} />

				<Calendar events={allEvents} language={language} />
				<Footer language={language} googleCalendar={GoogleCalendarUrl} />
			</section>
		</div>
	);
}
