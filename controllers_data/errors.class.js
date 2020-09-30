class NotFoundError extends Error {
  constructor(message = "Запись не найдена в БД") {
    super(message);
    this.name = this.constructor.name;
    this.status = 404;
    Error.captureStackTrace(this, this.constructor);
  }
}

class DbError extends Error {
  constructor(message = "Ошибка базы данных, повторите попытку позже") {
    super(message);
    this.status = 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class RecaptchaError extends Error {
  constructor(message = "Ошибка Recaptcha") {
    super(message);
    this.status = 201;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class DetectPfoneError extends Error {
  constructor(message = "Ошибка DetectPfoneError") {
    super(message);
    this.status = 201;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class OtherError extends Error {
  constructor(message = "Неизвестная ошибка, повторите попытку позже") {
    super(message);
    this.status = 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class DeliveryError extends Error {
  constructor(message = "DeliveryError, повторите попытку позже") {
    super(message);
    this.status = 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class OrderError extends Error {
  constructor(message = "CartError, повторите попытку позже") {
    super(message);
    this.status = 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

const globalErrorCheck = (e) => {
  if (e instanceof NotFoundError) {
    throw new NotFoundError(e.message);
  } else if (e instanceof DbError) {
    throw new DbError(e.message);
  } else if (e instanceof RecaptchaError) {
    throw new RecaptchaError(e.message);
  } else if (e instanceof DeliveryError) {
    throw new DeliveryError(e.message);
  } else if (e instanceof OrderError) {
    throw new OrderError(e.message);
  } else if (e instanceof DetectPfoneError) {
    throw new DetectPfoneError(e.message);
  } else {
    console.error(e);
    throw new OtherError(e.message);
  }
};

const getErrorStatus = (e, res) => {
  const status = e.status ? e.status : 500;
  const message = "Произошла ошибка на сервере, повторите попытку позже";

  if (!e.status) {
    console.error(e.message);
  }
  if (res) {
    return res.status(status).send(message);
  }
  return {
    status,
    message,
  };
};

module.exports = {
  NotFoundError,
  DbError,
  RecaptchaError,
  OtherError,
  DeliveryError,
  OrderError,
  DetectPfoneError,
  getErrorStatus,
  globalErrorCheck,
};
