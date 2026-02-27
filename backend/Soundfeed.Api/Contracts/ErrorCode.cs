using System.Text.Json.Serialization;

namespace Soundfeed.Api;

[JsonConverter(typeof(JsonStringEnumConverter<ErrorCode>))]
internal enum ErrorCode
{
    [JsonStringEnumMemberName("not_found")]
    NotFound,

    [JsonStringEnumMemberName("unauthorized")]
    Unauthorized,

    [JsonStringEnumMemberName("bad_request")]
    BadRequest,

    [JsonStringEnumMemberName("external_service_error")]
    ExternalServiceError,

    [JsonStringEnumMemberName("internal_error")]
    InternalError
}
