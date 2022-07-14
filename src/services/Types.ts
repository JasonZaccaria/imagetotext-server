//interface for our login object
interface loginObject {
  token?: string;
  rtoken?: string;
  failure?: string;
  function?: string;
  STOP?: string;
}

interface dataObject {
  image?: any[] | undefined;
  failure?: string | undefined;
}

interface userDataObject {
  success?: string | undefined;
  failure?: string | undefined;
}

interface deletePostObject {
  success?: string | undefined;
  failure?: string | undefined;
}

export { loginObject, dataObject, userDataObject, deletePostObject };
