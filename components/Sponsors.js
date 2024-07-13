export default async function Sponsors(props) {
    const { language, sponsors } = props
    return (
        <div className="grid grid-cols-3 gap-10 text-center">
            {sponsors.map(sponsor => <div className="sponsor">
                <div className="flex mx-auto w-[80%] h-[80%] mb-10">
                    <img className="w-full m-auto object-fill" src={sponsor.fields['Img']}></img>
                </div>
            </div>)}
        </div>
    )
}