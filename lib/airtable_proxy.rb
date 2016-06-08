require 'active_support/all'
require 'json'
require 'sinatra'
require 'airtable'

set :public_folder, File.dirname(__FILE__) + '/../public'

airtable_client = Airtable::Client.new(ENV['AIRTABLE_API_KEY'])
art_gallery_base_id = ENV['AIRTABLE_BASE_ID']
artists_table = airtable_client.table(art_gallery_base_id, 'Artists')

def artist_to_dict(artist)
  {
    artist_id: artist.id,
    name: artist['Name'],
    attachments: artist['Attachments'],
    on_display: artist['On Display?'],
  }
end

get '/' do
  redirect to('/art_gallery.html')
end

get '/v0/artists' do
  content_type :json
  {
    artists: artists_table.all.map {|artist| artist_to_dict(artist)}
  }.to_json
end

post '/v0/set_on_display' do
  artist_id = request.params['artist_id']
  is_on_display = request.params['on_display'] == "true"
  updated_artist = artists_table.update_record_fields(artist_id, {'On Display?' => is_on_display})
  content_type :json
  {
    artist: artist_to_dict(updated_artist)
  }.to_json
end
