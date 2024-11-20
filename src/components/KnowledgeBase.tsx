import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Link, Video, File } from 'lucide-react';
import { useStore } from '../store';
import { KnowledgeItem } from '../types';

export const KnowledgeBase: React.FC = () => {
  const { knowledgeBase, addKnowledgeItem } = useStore();
  const [url, setUrl] = React.useState('');

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const item: KnowledgeItem = {
            id: Date.now().toString(),
            type: file.type.includes('pdf')
              ? 'pdf'
              : file.type.includes('video')
              ? 'video'
              : 'text',
            title: file.name,
            content: reader.result as string,
            timestamp: new Date(),
          };
          addKnowledgeItem(item);
        };
        reader.readAsText(file);
      });
    },
    [addKnowledgeItem]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUrlSubmit = () => {
    if (!url) return;
    
    const item: KnowledgeItem = {
      id: Date.now().toString(),
      type: 'url',
      title: url,
      content: url,
      timestamp: new Date(),
    };
    
    addKnowledgeItem(item);
    setUrl('');
  };

  return (
    <div className="p-4 space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          {isDragActive
            ? 'Suelta los archivos aquí'
            : 'Arrastra archivos aquí o haz clic para seleccionar'}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Añade una URL"
          className="flex-1 p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleUrlSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Añadir
        </button>
      </div>

      <div className="space-y-2">
        {knowledgeBase.map((item) => (
          <div
            key={item.id}
            className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
          >
            {item.type === 'pdf' && <FileText className="w-5 h-5 text-red-500" />}
            {item.type === 'video' && <Video className="w-5 h-5 text-blue-500" />}
            {item.type === 'url' && <Link className="w-5 h-5 text-green-500" />}
            {item.type === 'text' && <File className="w-5 h-5 text-gray-500" />}
            <span className="flex-1 truncate">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};