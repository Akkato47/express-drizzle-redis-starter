const errorMessages: { [key in HttpStatus]: string } = {
    [HttpStatus.CONTINUE]: "Продолжайте",
    [HttpStatus.SWITCHING_PROTOCOLS]: "Переключение протоколов",
    [HttpStatus.PROCESSING]: "Обработка",
    [HttpStatus.EARLYHINTS]: "Ранние подсказки",
    [HttpStatus.OK]: "Успех",
    [HttpStatus.CREATED]: "Создано",
    [HttpStatus.ACCEPTED]: "Принято",
    [HttpStatus.NON_AUTHORITATIVE_INFORMATION]: "Неавторитетная информация",
    [HttpStatus.NO_CONTENT]: "Нет содержимого",
    [HttpStatus.RESET_CONTENT]: "Сбросить содержимое",
    [HttpStatus.PARTIAL_CONTENT]: "Частичное содержимое",
    [HttpStatus.AMBIGUOUS]: "Неоднозначно",
    [HttpStatus.MOVED_PERMANENTLY]: "Перемещено навсегда",
    [HttpStatus.FOUND]: "Найдено",
    [HttpStatus.SEE_OTHER]: "Смотрите другое",
    [HttpStatus.NOT_MODIFIED]: "Не изменено",
    [HttpStatus.TEMPORARY_REDIRECT]: "Временный редирект",
    [HttpStatus.PERMANENT_REDIRECT]: "Постоянный редирект",
    [HttpStatus.BAD_REQUEST]: "Неверный запрос",
    [HttpStatus.UNAUTHORIZED]: "Неавторизован",
    [HttpStatus.PAYMENT_REQUIRED]: "Требуется оплата",
    [HttpStatus.FORBIDDEN]: "Запрещено",
    [HttpStatus.NOT_FOUND]: "Не найдено",
    [HttpStatus.METHOD_NOT_ALLOWED]: "Метод не разрешен",
    [HttpStatus.NOT_ACCEPTABLE]: "Не принимается",
    [HttpStatus.PROXY_AUTHENTICATION_REQUIRED]:
        "Требуется аутентификация прокси",
    [HttpStatus.REQUEST_TIMEOUT]: "Время запроса истекло",
    [HttpStatus.CONFLICT]: "Конфликт",
    [HttpStatus.GONE]: "Ушло",
    [HttpStatus.LENGTH_REQUIRED]: "Требуется длина",
    [HttpStatus.PRECONDITION_FAILED]: "Предварительное условие не выполнено",
    [HttpStatus.PAYLOAD_TOO_LARGE]: "Содержимое слишком велико",
    [HttpStatus.URI_TOO_LONG]: "URI слишком длинный",
    [HttpStatus.UNSUPPORTED_MEDIA_TYPE]: "Неподдерживаемый тип медиа",
    [HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE]:
        "Запрашиваемый диапазон не может быть удовлетворен",
    [HttpStatus.EXPECTATION_FAILED]: "Ожидание не выполнено",
    [HttpStatus.I_AM_A_TEAPOT]: "Я - чайник",
    [HttpStatus.MISDIRECTED]: "Неправильно направлено",
    [HttpStatus.UNPROCESSABLE_ENTITY]: "Невозможно обработать сущность",
    [HttpStatus.FAILED_DEPENDENCY]: "Неудачная зависимость",
    [HttpStatus.PRECONDITION_REQUIRED]: "Требуется предварительное условие",
    [HttpStatus.TOO_MANY_REQUESTS]: "Слишком много запросов",
    [HttpStatus.INTERNAL_SERVER_ERROR]: "Внутренняя ошибка сервера",
    [HttpStatus.NOT_IMPLEMENTED]: "Не реализовано",
    [HttpStatus.BAD_GATEWAY]: "Плохой шлюз",
    [HttpStatus.SERVICE_UNAVAILABLE]: "Служба недоступна",
    [HttpStatus.GATEWAY_TIMEOUT]: "Время ожидания шлюза",
    [HttpStatus.HTTP_VERSION_NOT_SUPPORTED]: "Версия HTTP не поддерживается",
};

export class CustomError extends Error {
    statusCode: HttpStatus;

    constructor(statusCode: HttpStatus, customMessage?: string) {
        const defaultMessage = errorMessages[statusCode];
        const message = customMessage
            ? `${defaultMessage}: ${customMessage}`
            : defaultMessage;
        super(message);
        this.statusCode = statusCode;
    }
}
