module.exports = {

    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------
    
    name: "Get Youtube Video Info",
    
    //---------------------------------------------------------------------
    // DBM Mods Manager Variables (Optional but nice to have!)
    //
    // These are variables that DBM Mods Manager uses to show information
    // about the mods for people to see in the list.
    //---------------------------------------------------------------------
    
        // Who made the mod (If not set, defaults to "DBM Mods")
        author: "Armağan",
    
        // The version of the mod (Defaults to 1.0.0)
        version: "1.0.0", //Added in 1.8.7
    
        // A short description to show on the mod line for this mod (Must be on a single line)
        short_description: "Provides information about the YouTube URL that a user enters.",
    
        // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
    
    //---------------------------------------------------------------------
    // Action Section
    //
    // This is the section the action will fall into.
    //---------------------------------------------------------------------
    
    section: "Audio Control",
    
    //---------------------------------------------------------------------
    // Action Subtitle
    //
    // This function generates the subtitle displayed next to the name.
    //---------------------------------------------------------------------
    
    subtitle: function(data) {
        const outtype = ["Video URL", "Video Title", "Full Description", "Video ID", "Video Published At", "Video Kind", "Video ISO8601 Duration", "Video Defaulth Thumbnail URL", "Video Defaulth Medium URL", "Video Defaulth High URL", "Video Channel Name", "Video Channel URL", "Video Channel ID"]
        return `YouTube ${outtype[parseInt(data.outtype)]}`;
    },
    
    //---------------------------------------------------------------------
    // Action Storage Function
    //
    // Stores the relevant variable info for the editor.
    //---------------------------------------------------------------------
    
    variableStorage: function(data, varType) {
        const type = parseInt(data.storage);
        if(type !== varType) return;
        const outtype = parseInt(data.outtype);
		let dataType = 'Unknown YouTube Type';
		switch (outtype) {
            case 0:
            dataType = "Youtube Video URL";
                break;
            case 1:
            dataType = "Youtube Video Title";
                break;
            case 2:
            dataType = "Youtube Video Full Description";
                break;
            case 3:
            dataType = "Youtube Video ID";
                break;
            case 4:
            dataType = "Youtube Video Published At";
                break;
            case 5:
            dataType = "Youtube Video Kind";
                break;
            case 6:
            dataType = "Youtube Video ISO8601 Duration";
                break;
            case 7:
            dataType = "Youtube Video Defaulth Thumbnail URL";
                break;
            case 8:
            dataType = "Youtube Video Medium Thumbnail URL";
                break;
            case 9:
            dataType = "Youtube Video High Thumbnail URL";
                break;
            case 10:
            dataType = "Youtube Video Channel Name";
                break;
            case 11:
            dataType = "Youtube Video Channel URL";
                break;
            case 12:
            dataType = "Youtube Video Channel ID";
                break;
        }
		return ([data.varName, dataType]);

    },
    
    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------
    
    fields: ["storage", "varName", "videourl", "apikey", "outtype"],
    
    //---------------------------------------------------------------------
    // Command HTML
    //
    // This function returns a string containing the HTML used for
    // editting actions.
    //
    // The "isEvent" parameter will be true if this action is being used
    // for an event. Due to their nature, events lack certain information,
    // so edit the HTML to reflect this.
    //
    // The "data" parameter stores constants for select elements to use.
    // Each is an array: index 0 for commands, index 1 for events.
    // The names are: sendTargets, members, roles, channels,
    //                messages, servers, variables
    //---------------------------------------------------------------------
    
    html: function(isEvent, data) {
        return `
    <div>
      <div>
      <u>Mod Info:</u><br>Created by Armağan!
      </div>
      <br>
    
      <div style="width: 95%;">
      Youtube Video Url:<br>
      <textarea id="videourl" rows="2" placeholder="Write a video url here or use variables..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
      </div> <br>

      <div style="width: 95%;">
		API Key:<br>
        <textarea id="apikey" rows="2" placeholder="Write your key. Get one from Google. Youtube  API V3" style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
     </div>
     <br>
     <div style="width: 60%;">
		Source Info:<br>
        <select id="outtype" class="round">

         <optgroup label="Video Info">
			<option value="0">Video URL</option>
			<option value="1">Video Name</option>
            <option value="2">Video Full Description</option>
            <option value="3">Video ID</option>
			<option value="4">Video Published At</option>
            <option value="5">Video Kind</option>
            <option value="6">Video ISO8601 Duration</option>
         <optgroup label="Video Thubnails">
            <option value="7">Video Defaulth Thumbnail URL</option>
			<option value="8">Video Medium Thumbnail URL</option>
            <option value="9">Video High Thumbnail URL</option>
         </optgroup>
        </optgroup>
        <optgroup label="Channel Info">
            <option value="10">Channel Name</option>
            <option value="11">Channel URL</option>
            <option value="12">Channel ID</option>  
        </optgroup>
		</select>
    </div>
    <br>

   </div>
    
        <div>
            <div style="float: left; width: 35%;">
                Store In:<br>
                <select id="storage" class="round">
                    ${data.variables[1]}
                </select>
            </div>
            <div id="varNameContainer" style="float: right; width: 60%;">
                Variable Name:<br>
                <input id="varName" class="round" type="text">
            </div>
         </div>
    
        </div>`
    },
    
    //---------------------------------------------------------------------
    // Action Editor Init Code
    //
    // When the HTML is first applied to the action editor, this code
    // is also run. This helps add modifications or setup reactionary
    // functions for the DOM elements.
    //---------------------------------------------------------------------
    
    init: function() {
    },
    
    //---------------------------------------------------------------------
    // Action Bot Function
    //
    // This is the function for the action within the Bot's Action class.
    // Keep in mind event calls won't have access to the "msg" parameter,
    // so be sure to provide checks for variable existance.
    //---------------------------------------------------------------------
    
    action: async function(cache) {
        const data = cache.actions[cache.index];
        const storage = parseInt(data.storage);
        const varName = this.evalMessage(data.varName, cache);

        
        const videourl = this.evalMessage(data.videourl, cache);
        const apikey = this.evalMessage(data.apikey, cache);
        const outtype = parseInt(data.outtype);

        if (!videourl) return console.log("${this.name}: Please specify a video url to get video informations.");
		if (!apikey) return console.log("${this.name}: Please get your key from Google and write it in the field.");
    
    
        var _this = this;
        const WrexMODS = _this.getWrexMods();
        WrexMODS.CheckAndInstallNodeModule('simple-youtube-api');
        const search = WrexMODS.require('simple-youtube-api');
   
            const YouTube = require("simple-youtube-api")
            const youtube = new YouTube(apikey)
            const video = await youtube.getVideo(videourl, { part: 'contentDetails,snippet' })
            
            var output = "";
            switch (outtype) {
                case 0:
                    output = "https://www.youtube.com/watch?v="+video.id;
                    break;
                case 1:
                    output = video.title;
                    break;
                case 2:
                    output = video.description;
                    break;
                case 3:
                    output = video.id;
                    break;
                case 4:
                    output = video.publishedAt;
                    break;
                case 5:
                    output = video.kind;
                    break;
                case 6:
                    output = video.raw.contentDetails.duration;
                    break;
                case 7:
                    output = video.thumbnails.default.url;
                    break;
                case 8:
                    output = video.thumbnails.medium.url;
                    break;
                case 9:
                    output = video.thumbnails.high.url;
                    break;
                case 10:
                    output = video.channel.title;
                    break;
                case 11:
                    output = "https://www.youtube.com/channel/"+video.channel.id;
                    break;
                case 12:
                    output = video.channel.id;
                    break;
                default:
                    break;
            }
       
        this.storeValue(output, storage, varName, cache);
        this.callNextAction(cache);
    },
    
    //---------------------------------------------------------------------
    // Action Bot Mod
    //
    // Upon initialization of the bot, this code is run. Using the bot's
    // DBM namespace, one can add/modify existing functions if necessary.
    // In order to reduce conflictions between mods, be sure to alias
    // functions you wish to overwrite.
    //---------------------------------------------------------------------
    
    mod: function(DBM) {
    }
    
    }; // End of module
    