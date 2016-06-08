require 'json'
require 'sinatra'

set :public_folder, File.dirname(__FILE__) + '/../public'

airtable_client = Airtable::Client.new(ENV['AIRTABLE_API_KEY'])
art_gallery_base_id = ENV['AIRTABLE_BASE_ID']
artists_table = airtable_client.table(art_gallery_base_id, "Artists")

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
  all_artists = artists_table.all
  limited_artist_info = all_artists.map(&:artist_to_dict)
  content_type :json
  limited_artist_info.to_json
end

post '/v0/set_on_display' do
  requestBody = JSON.parse(request.body.read)
  artist_id = requestBody.artist_id
  is_on_display = requestBody.artist_id

  updated_record = artists_table.update(artist_id, {'On Display?': is_on_display})
  content_type :json
  artist_to_dict(updated_artist).to_json
end
