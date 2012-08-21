/* dragndrop_attachments script */
if (window.rcmail) {
	rcmail.addEventListener('init', function(evt) {
			$(document).ready(function() {
				var drag_attach = document.getElementById('compose-attachments');
				drag_attach.ondragenter = drag_attach.ondragover = function (e) {
				e.preventDefault();
				$('#compose-attachments').css("background-color", "#FFFFA6");
				e.dataTransfer.dropEffect = 'copy';
				return false;
				}

				drag_attach.ondragleave = function (e) {
				e.preventDefault();
				$('#compose-attachments').css("background-color", "#fff");
				e.dataTransfer.dropEffect = 'copy';
				return false;
				}

				drag_attach.ondrop = upload;

				function createInstance()
				{
				if (window.XMLHttpRequest)
				{
					req = new XMLHttpRequest();
				}
				else
					rcmail.display_message(rcmail.get_label('fileuploaderror'), 'error');
				return(req);
				};

				function getBuilder(fname, fdata, bdary) {
					var dashdash = '--',
						crlf = '\r\n',
						builder = '';

					
					builder += dashdash;
					builder += bdary;
					builder += crlf;
					builder += 'Content-Disposition: form-data; name="_token"';
					builder += crlf;
					builder += crlf;
					builder += document.getElementsByName("_token")[0].value;
					builder += crlf;
					/* Write boundary. */
					builder += dashdash;
					builder += bdary;
					builder += crlf;
					builder += 'Content-Disposition: form-data; name="_attachments[]"';
					builder += '; filename="' + fname + '"';
					builder += crlf;
					
					builder += 'Content-Type: application/octet-stream';
					builder += crlf;
					builder += crlf; 
					
					builder += fdata;
					builder += crlf;
			        
					builder += dashdash;
					builder += bdary;
					builder += dashdash;
					builder += crlf;
					return builder;
				}
			function upload(event) {
				event.stopPropagation();
				event.preventDefault();
				$('#compose-attachments').css("background-color", "#fff");
				data = event.dataTransfer;
				for (var i = 0; i < data.files.length; i++) {
						var reader = new FileReader();
						reader.data = data;
						reader.file = data.files[i];
						var file = data.files[i];
						reader.name = data.files[i].name;
						reader.onload = function(e) {
							
							var ts = new Date().getTime(),
							    frame_name = 'rcmupload'+ts;
                                                        var id = ts;

							var action = rcmail.url("upload", { _id:rcmail.env.compose_id||'', _uploadid:ts });

							var boundary = '----WebKitFormBoundary' + (new Date).getTime();
							/* Build RFC2388 string. */
							var builder = '';
							var xhr = createInstance();
							builder = getBuilder(e.target.name, e.target.result, boundary);

						    xhr.open("POST", action, true);
							xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' + boundary);
							xhr.onload = upload_finish;
							
							xhr.sendAsBinary = function(datastr) {
								function byteValue(x) {
							        return x.charCodeAt(0) & 0xff;
							    }
							    var ords = Array.prototype.map.call(datastr, byteValue);
							    var ui8a = new Uint8Array(ords);
							    this.send(ui8a.buffer);
							}

							xhr.sendAsBinary(builder);
							var files=data.files;
							
							var content = '<span>' + rcmail.get_label('uploading' + (files > 1 ? 'many' : '')) + '</span>',
						        ts = frame_name.replace(/^rcmupload/, '');

						      if (rcmail.env.loadingicon)
						        content = '<img src="'+rcmail.env.loadingicon+'" alt="" class="uploading" />'+content;
						      content = '<a title="'+rcmail.get_label('cancel')+'" onclick="return rcmail.cancel_attachment_upload(\''+ts+'\', \''+frame_name+'\');" href="#cancelupload" class="cancelupload">'
						        + (rcmail.env.cancelicon ? '<img src="'+rcmail.env.cancelicon+'" alt="" />' : rcmail.get_label('cancel')) + '</a>' + content;

						      rcmail.add2attachment_list(ts, { name:'', html:content, classname:'uploading', complete:false });

							
						}
						reader.readAsBinaryString(file);
					

				}

				function upload_finish(event) {
					var d, content = '';
					try {
						
						 
				          if (this.contentDocument) {
				            d = this.contentDocument;
				            content = d.childNodes[0].innerHTML;
				          } else if (this.contentWindow) {
				            d = this.contentWindow.document;
				            content = d.childNodes[0].innerHTML;
				          }
				          else{
				          content = this.responseText;
				      	  }

				      if (!content.match(/add2attachment/) ) {
							if (!content.match(/display_message/))
								rcmail.display_message(rcmail.get_label('fileuploaderror'), 'error');
							rcmail.remove_from_attachment_list(e.data.ts);
						}
					var from = content.search('rcmfile');
					var to = from + 31;
					var frame_name = content.substring(from, to);
			        
			        if (document.all) {
				      var html = '<iframe name="'+frame_name+'" src="program/blank.gif" style="width:0;height:0;visibility:hidden;"></iframe>';
				      document.body.insertAdjacentHTML('BeforeEnd', html);
				    }
				    else { // for standards-compilant browsers
				      var frame = document.createElement('iframe');
				      frame.name = frame_name;
				      frame.style.border = 'none';
				      frame.style.width = 0;
				      frame.style.height = 0;
				      frame.style.visibility = 'hidden';
				      document.body.appendChild(frame);
				    }

				    var doc = frame.document;
						if(frame.contentDocument)
							doc = frame.contentDocument; // For NS6
						else if(frame.contentWindow)
							doc = frame.contentWindow.document; // For IE5.5 and IE6
						// Put the content in the iframe
						doc.open();
						doc.writeln(content);
						doc.close();
				          
        
					} catch (err) {

						
					}
					

				};


				/* Prevent FireFox opening the dragged file. */
				event.stopPropagation();

			}

			});
	})

}