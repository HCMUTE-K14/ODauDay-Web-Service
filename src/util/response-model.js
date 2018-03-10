module.exports = ResponseModel;

function ResponseModel({ code, status_text, success, data, errors }) {
    this.datetime = new Date();
    this.timestamp = this.datetime.getTime();
    this.code = code;
    this.status_text = status_text;
    this.success = success;
    this.data = data;
    this.errors = errors;

    cleanResponse(this);
}

function cleanResponse(response) {
    cleanProperty(response, 'data');
    cleanProperty(response, 'errors');
}

function cleanProperty(response, property) {
    if (response[property] === null || response[property] === undefined) {
        delete response[property];
    }
}