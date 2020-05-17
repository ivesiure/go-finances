import React, { useState } from 'react';
import filesize from 'filesize';
import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';
import alert from '../../assets/alert.svg';
import api from '../../services/api';
import { Container, Title, ImportFileContainer, Footer } from './styles';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);

  async function handleUpload(): Promise<void> {
    const [file] = uploadedFiles;

    const data = new FormData();
    data.append('file', file.file);

    try {
      await api.post('/transactions/import', data);
      setUploadedFiles([]);
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    const incomingFiles = files.map(
      file =>
        ({
          file,
          name: file.name,
          readableSize: filesize(file.size),
        } as FileProps),
    );
    setUploadedFiles(incomingFiles);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}
          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
