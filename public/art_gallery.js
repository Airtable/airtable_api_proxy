const PageHeader = ReactBootstrap.PageHeader;
const Navbar = ReactBootstrap.Navbar;

const AttachmentsColumn = React.createClass({
    render() {
        const attachments = this.props.rowData.attachments;
        return _.map(attachments, attachment => {
            return <img key={attachment.id} url={attachment.url} />;
        });
    }
});

const ArtGallery = React.createClass({
    render() {
        var columnMetadata = [
            {
                columnName: "name",
                displayName: "Artist name",
                visible: true,
                order: 0,
            },
            {
                columnName: "on_display",
                displayName: "On Disply?",
                visible: true,
                order: 1,
            },
            {
                columnName: "attachments",
                displayName: "Artwork",
                visible: true,
                customComponent: AttachmentsColumn,
                order: 2,
            },
        ];
        return (
            <ReactBootstrap.Panel>
                <h4>Art gallery</h4>
                <ReactBootstrap.Grid fluid={true}>
                    <ReactBootstrap.Row className="show-grid">
                        <ReactBootstrap.Col xs={0} md={0} lg={2}>
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} md={12} lg={8}>
                            <Griddle results={this.state.artists} showFilter={true} showSettings={true} columnMetadata={columnMetadata} resultsPerPage={20}/>
                        </ReactBootstrap.Col>
                    </ReactBootstrap.Row>
                </ReactBootstrap.Grid>
            </ReactBootstrap.Panel>
        );
    },
});

var mountNode = document.getElementById('appRoot');
window.artGallery = new ArtGallery(mountNode);
