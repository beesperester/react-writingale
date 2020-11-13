export const Section = ({ section }) => {
    return (
        <div className="card section">

            <div className="card-body">

                <p>{section.contents}</p>

            </div>

        </div>
    );
};

export default Section;