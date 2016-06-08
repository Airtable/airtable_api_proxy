const _ = window._;
const React = window.React;
const ReactDOM = window.ReactDOM;
const Griddle = window.Griddle;

const customColumnProps = {
    data: React.PropTypes.object.required,
    rowData: React.PropTypes.object.required,
    metadata: React.PropTypes.object.required,
};

const CheckboxColumn  = React.createClass({
    propTypes: customColumnProps,
    render() {
        const columnName = this.props.metadata.columnName;
        const columnValue = this.props.rowData[columnName];
        if (columnValue) {
            return <div>YES</div>;
        } else {
            return <div />;
        }
    },
});

const AttachmentsColumn = React.createClass({
    propTypes: customColumnProps,
    render() {
        const columnName = this.props.metadata.columnName;
        const attachments = this.props.rowData[columnName];
        const attachmentImages = _.map(attachments, attachment => {
            return <img className="artworkPreview" key={attachment.id} src={attachment.url} />;
        });
        return <div>{attachmentImages}</div>;
    },
});

const ArtGallery = React.createClass({
    propTypes: {
        artists: React.PropTypes.array,
        updateOnDisplay: React.PropTypes.func,
    },
    _toggleOnDisplay(gridRow, event) {
        const artistId = gridRow.props.data.artist_id;
        this.props.updateOnDisplay(artistId, !gridRow.props.data.on_display);
    },
    _renderArtistsIfLoaded() {
        if (this.props.artists) {
            const columnMetadata = [
                {
                    columnName: "name",
                    displayName: "Artist name",
                    cssClassName: "artistNameColumn",
                    visible: true,
                    order: 0,
                },
                {
                    columnName: "on_display",
                    displayName: "On Display?",
                    customComponent: CheckboxColumn,
                    cssClassName: "onDisplayColumn",
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
                {
                    columnName: "artist_id",
                    displayName: "id",
                    visible: false,
                    order: 3,
                },
            ];
            // Only need the columns due to a bug in griddle https://github.com/GriddleGriddle/Griddle/issues/114
            const columns = ["name", "on_display", "attachments"];
            return <Griddle onRowClick={this._toggleOnDisplay} results={this.props.artists} showFilter={true} showSettings={true} columnMetadata={columnMetadata} columns={columns} resultsPerPage={10} />;
        } else {
            return <div> Loading </div>;
        }
    },
    render() {
        return (
            <ReactBootstrap.Panel>
                <h1>Art gallery</h1>
                <ReactBootstrap.Grid fluid={true}>
                    <ReactBootstrap.Row className="show-grid">
                        <ReactBootstrap.Col xs={0} md={0} lg={2}>
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} md={12} lg={8}>
                            {this._renderArtistsIfLoaded()}
                        </ReactBootstrap.Col>
                    </ReactBootstrap.Row>
                </ReactBootstrap.Grid>
            </ReactBootstrap.Panel>
        );
    },
});

const ArtGalleryApp = React.createClass({
    propTypes: {
        // No props here
    },
    getInitialState() {
        return {
            artists: null,
        };
    },
    componentDidMount() {
        this._loadArtists();
    },
    _loadArtists() {
        $.ajax('/v0/artists').then((response, status, jqXHR) => {
            this.setState({
                artists: response.artists,
            });
        });
    },
    _updateOnDisplay(artistId, isOnDisplay) {
        $.ajax('/v0/set_on_display', {
            method: 'POST',
            data: {
                artist_id: artistId,
                on_display: isOnDisplay,
            },
        }).then((response, status, jqXHR) => {
            const updatedArtists = response.artist;
            const newArtists = _.map(this.state.artists, artist => {
                if (artist.artist_id === artistId) {
                    return _.extend({}, artist, updatedArtists);
                } else {
                    return artist;
                }
            });
            this.setState({
                artists: newArtists,
            });
        });
    },
    render() {
        return (
            <ArtGallery artists={this.state.artists} updateOnDisplay={this._updateOnDisplay}/>
        );
    },
});

var rootNode = document.getElementById('appRoot');
ReactDOM.render(<ArtGalleryApp/>, rootNode);
