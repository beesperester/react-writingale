// app
import Section from './Section';

export const Sections = ({ article }) => {
    return (
        <div>

            {article.sectionsByArticleId.nodes.map(node => (
                <Section key={node.id} id={node.id} />
            ))}

        </div>
    );
};

export default Sections;