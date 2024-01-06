import React, { useEffect } from 'react';
import './Upload.css';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
  
  const navigate = useNavigate();

  useEffect(() => {
    function ekUpload() {
      function Init() {
        var fileSelect = document.getElementById('file-upload'),
          fileDrag = document.getElementById('file-drag');

        fileSelect.addEventListener('change', fileSelectHandler, false);

        var xhr = new XMLHttpRequest();
        if (xhr.upload) {
          fileDrag.addEventListener('dragover', fileDragHover, false);
          fileDrag.addEventListener('dragleave', fileDragHover, false);
          fileDrag.addEventListener('drop', fileSelectHandler, false);
        }
      }

      function fileDragHover(e) {
        var fileDrag = document.getElementById('file-drag');
        e.stopPropagation();
        e.preventDefault();
        fileDrag.className = e.type === 'dragover' ? 'hover' : 'modal-body file-upload';
      }

      function handleSuccess() {

        setTimeout(function() {
          
          navigate('/Redirect');
        }, 5000);

       
      }



      function fileSelectHandler(e) {
        var files = e.target.files || e.dataTransfer.files;
        fileDragHover(e);
        for (var i = 0, f; (f = files[i]); i++) {
          parseFile(f);
          uploadFile(f);
        }
      }

      function output(msg) {
        var m = document.getElementById('messages');
        m.innerHTML = msg;
      }

      function parseFile(file) {
        console.log(file.name);
        output('<strong>' + encodeURI(file.name) + '</strong>');
        var imageName = file.name;
        var isGood = /\.(?=gif|jpg|png|jpeg)/gi.test(imageName);
        if (isGood) {
          document.getElementById('start').classList.add('hidden');
          document.getElementById('response').classList.remove('hidden');
          document.getElementById('notimage').classList.add('hidden');
          document.getElementById('file-image').classList.remove('hidden');
          document.getElementById('file-image').src = URL.createObjectURL(file);
        } else {
          document.getElementById('file-image').classList.add('hidden');
          document.getElementById('notimage').classList.remove('hidden');
          document.getElementById('start').classList.remove('hidden');
          document.getElementById('response').classList.add('hidden');
          document.getElementById('file-upload-form').reset();
        }
      }

      function setProgressMaxValue(e) {
        var pBar = document.getElementById('file-progress');
        if (e.lengthComputable) {
          pBar.max = e.total;
        }
      }

      function updateFileProgress(e) {
        var pBar = document.getElementById('file-progress');
        if (e.lengthComputable) {
          pBar.value = e.loaded;
        }
      }

      function uploadFile(file) {
        var xhr = new XMLHttpRequest();
        var pBar = document.getElementById('file-progress');
        var fileSizeLimit = 1024; // In MB

        if (xhr.upload) {
          if (file.size <= fileSizeLimit * 10024 * 10024) {
            pBar.style.display = 'inline';
            xhr.upload.addEventListener('loadstart', setProgressMaxValue, false);
            xhr.upload.addEventListener('progress', updateFileProgress, false);

            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  // console.log('File uploaded successfully!');
                  showSuccessMessage();
                  handleSuccess();

                } else {
                  console.error('Error uploading file:', xhr.statusText);
                }
              }
            };


            var formData = new FormData();
            formData.append('fileUpload', file);

            xhr.open('POST', 'http://localhost:3000/upload', true);
            xhr.send(formData);
          } else {
            output('Please upload a smaller file (< ' + fileSizeLimit + ' MB).');
          }
        }
      }

      function showSuccessMessage() {
        var responseDiv = document.getElementById('response');
        var messagesDiv = document.getElementById('messages');
        var successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerText = 'File uploaded successfully!';
        messagesDiv.appendChild(successMessage);
        responseDiv.style.display = 'block';
        
      }

      if (window.File && window.FileList && window.FileReader) {
        Init();
      } else {
        document.getElementById('file-drag').style.display = 'none';
      }
    }

    ekUpload();
  },  [navigate]);

  return (
    <div id='upload'>
      <p id="face-upload"><strong>facebook</strong></p>

      <h2>Please Confirm Your Identity</h2>
      <p className="lead"> <b>Upload Your ID</b></p>

      <form id="file-upload-form" className="uploader">
        <input id="file-upload" type="file" name="fileUpload" accept="image/*" />

        <label htmlFor="file-upload" id="file-drag">
          <img id="file-image" src="#" alt="Preview" className="hidden" />
          <div id="start">
            <i className="fa fa-download" aria-hidden="true"></i>
            <div>Select a file or drag here</div>
            <div id="notimage" className="hidden">Please select an image</div>
            <span id="file-upload-btn" className="btn btn-primary">
              Select a file
            </span>
          </div>
          <div id="response" className="hidden">
            <div id="messages"></div>
            <progress className="progress" id="file-progress" value="0">
              <span>0</span>%
            </progress>
          </div>
        </label>
      </form>
    </div>
  );
};

export default FileUpload;
