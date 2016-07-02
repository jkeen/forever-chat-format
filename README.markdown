##Forever Chat Format

##Why

Because in the world where our communication is siloed into Google Hangouts, Facebook, iMessage, WhatsApp, etc etc it's getting hard to hold onto conversations for archival purposes. First thing we need is a universal format that we can export those proprietary chats into that's easy to understand, and that can be relied upon.

##Basic Format

Output should be an array of hashes, and each object in the array is a JSON object defined as follows:

##Chat Object Definition:

Name              | Type              | Description
-----------       | -------           |   -------------
sha               | string            | sha1 of [participants, date, text, service]
sender            | string            | The handle of the person sending the message
receiver          | string            | The handle of the person receiving the message
is_from_me        | boolean           | true if you sent the message
date              | ISO-8601 datetime | date message was sent/received by sender
service           | string            | Service message was sent using. All lowercase, dasherized. 'imessage', 'google-hangouts', 'facebook-messenger', 'sms'
date_read         | ISO-8601 datetime | (optional) date message was sent/read by receiver
date_delivered    | ISO-8601 datetime | (optional) date message was delivered by receiver
participants      | array             | (see definition below) An array of strings of handles involved in the conversations. Used for grouping. For a two person conversation, this has two entries in it. Sender and receiver are always here.
message_text      | string            | text representation of the message
message_segments  | array             | (see definition below) ordered segments of content as it appears in the message
attachments       | array             | (see definition below) array of attachments
\_debug            | object            | (optional) debug information to help trace back to the source of the data


####Message Segment Definition

Name        |  Type      |  Possible Values    | Description
----------- |  -------   |  -----------------  | -------------
type        | string     |  text, link, file   | base segment type
file_type   | string     |  null, or a mime_type | only valid when type == file
path        | string     |  url or file path  |  
text        | string     |                    | the rendered name of the link, or the text content for the text, or optionally


##### Text Segment
```json
{"type": "text", "text": "Why hello there"}
```
##### Link Segment
```json
{"type": "link", "text": "Whoa, unreal", "path": "http://latlmes.com/technology/why-we-need-a-new-chat-format-1"}
```
##### File Segment
```json
{"type": "file", "file_type": "image/png", "path": "/path/to/image.png"}
```


##### Attachments
Array of attachments in the order they were received. Each attachment has the following properties. This information
should also be made available in message_segments.

Name        |  Type     
----------- |  -------  
path        | string    
type        | string    


##Tests:
The included tests check whether some json is valid forever chat format.
```javascript
var foreverJson    = importer("test.json"); // done by an exporter

var formatTests    = require('forever-chat-format-tests');
formatTests(foreverJson);
```
