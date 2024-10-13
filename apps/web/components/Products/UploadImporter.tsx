import { Importer, ImporterField } from "react-csv-importer";

// include the widget CSS file whichever way your bundler supports it
import "react-csv-importer/dist/index.css";

export type UploadDataHandler = (rows: any[], props?: any) => void;

export interface UploadEventProps {
  file: any;
  preview: any;
  fields: any;
  columnFields: any;
}
export type UploadEventHandler = ({
  file,
  preview,
  fields,
  columnFields,
}: UploadEventProps) => void;

export interface UploadImporterProps {
  dataHandler?: UploadDataHandler;
  onStart?: UploadEventHandler;
  onComplete?: UploadEventHandler;
  onClose?: UploadEventHandler;
}
export const UploadImporter = ({
  dataHandler = undefined,
  onStart = undefined,
  onComplete = undefined,
  onClose = undefined,
}: UploadImporterProps): React.ReactNode => {
  return (
    <>
      {/* @ts-ignore */}
      <Importer
        dataHandler={dataHandler}
        onStart={onStart}
        onComplete={onComplete}
        onClose={onClose}
        defaultNoHeader={false}
        restartable={true}
        //  dataHandler={async (rows, { startIndex }) => {
        //    * required, may be called several times
        //    * receives a list of parsed objects based on defined fields and user column mapping;
        //    * (if this callback returns a promise, the widget will wait for it before parsing more data)
        //    for (let row of rows) {
        //      await dataHandler(row);
        //    }
        //  }}
        //  defaultNoHeader={false} // optional, keeps "data has headers" checkbox off by default
        //  restartable={false} // optional, lets user choose to upload another file when import is complete
        //  onStart={({ file, preview, fields, columnFields }) => {
        //    * optional, invoked when user has mapped columns and started import
        //  }}
        //  onComplete={({ file, preview, fields, columnFields }) => {
        //    * optional, invoked right after import is done (but user did not dismiss/reset the widget yet)
        //  }}
        //  onClose={({ file, preview, fields, columnFields }) => {
        //    * optional, if this is specified the user will see a "Finish" button after import is done,
        //    * which will call this when clicked
        //  }}

        // CSV options passed directly to PapaParse if specified:
        // delimiter={...}
        // newline={...}
        // quoteChar={...}
        // escapeChar={...}
        // comments={...}
        // skipEmptyLines={...}
        // delimitersToGuess={...}
        // chunkSize={...} // defaults to 10000
        // encoding={...} // defaults to utf-8, see FileReader API
      >
        <ImporterField name="quantity" label="Quantity" />
        <ImporterField name="sku" label="SKU" />
        <ImporterField name="description" label="Description" />
        <ImporterField name="storeId" label="Store" />
      </Importer>
    </>
  );
};
