/**
 * Central export file for all validators
 * Import validators from here instead of individual files
 */

// Auth validators
export { validatorLogin } from './auth/validatorLogin';
export { validatorRegister } from './auth/validatorRegister';
export { validatorChangePassword } from './auth/validatorChangePassword';

// Author validators
export { validatorCreateAuthor } from './author/validatorCreateAuthor';

// Book validators
export { validatorCreateBook } from './book/validatorCreateBook';

// BookAuthor validators
export { validatorCreateBookAuthor } from './book_author/validatorCreateBookAuthor';

// Cabinet validators
export { validatorCreateCabinet } from './cabinet/validatorCreateCabinet';

// Category validators
export { validatorCreateCategory } from './category/validatorCreateCategory';

// Copybook validators
export { validatorCreateCopybook } from './copybook/validatorCreateCopybook';

// CopybookLocation validators
export { validatorCreateCopybookLocation } from './copybook_location/validatorCreateCopybookLocation';

// Edition validators
export { validatorCreateEdition } from './edition/validatorCreateEdition';

// Employee validators
export { validatorCreateEmployee } from './employee/validatorCreateEmployee';

// Genre validators
export { validatorCreateGenre } from './genre/validatorCreateGenre';

// Lending validators
export { validatorCreateLending } from './lending/validatorCreateLending';

// LendingCopybook validators
export { validatorCreateLendingCopybook } from './lending_copybook/validatorCreateLendingCopybook';

// OrderEdition validators
export { validatorCreateOrderEdition } from './order_edition/validatorCreateOrderEdition';

// Orders validators
export { validatorCreateOrders } from './orders/validatorCreateOrders';

// Position validators
export { validatorCreatePosition } from './position/validatorCreatePosition';

// Publisher validators
export { validatorCreatePublisher } from './publisher/validatorCreatePublisher';

// Reader validators
export { validatorCreateReader } from './reader/validatorCreateReader';

// Shelf validators
export { validatorCreateShelf } from './shelf/validatorCreateShelf';

// User validators
export { validatorEdit } from './users/validatorEdit';
