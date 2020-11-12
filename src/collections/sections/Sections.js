// app
import Section from './Section';

export const Sections = ({ article }) => {
    return (
        <div>

            {article.sectionsByArticleId.nodes.map(node => (
                <Section key={node.nodeId} section={node} />
            ))}

        </div>
    );
};

export default Sections;