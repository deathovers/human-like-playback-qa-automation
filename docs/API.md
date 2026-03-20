# API Documentation

This document describes the JSON-based interface for the Human-like Playback QA Automation system.

## Input Schema

The system accepts a JSON object defining the batch of tests to be executed.

### Request Object

| Field | Type | Description |
| :--- | :--- | :--- |
| `batchId` | `string` | Unique identifier for the test batch. |
| `tests` | `array` | A list of test case objects. |
| `config` | `object` | Global configuration for the batch. |

### Test Case Object

| Field | Type | Description |
| :--- | :--- | :--- |
| `url` | `string` | The URL of the video page to test. |
| `contentId` | `string` | Identifier for the content being tested. |

### Config Object

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `timeout` | `number` | `30000` | Global timeout in milliseconds. |
| `validationDuration` | `number` | `10000` | Required playback duration in milliseconds. |

**Example Input:**
```json
{
  "batchId": "batch_2026_03_20_001",
  "tests": [
    { "url": "https://example-ott.com/watch/123", "contentId": "movie_123" }
  ],
  "config": {
    "timeout": 45000,
    "validationDuration": 10000
  }
}
```

---

## Output Schema

The system returns a JSON object for each test case processed.

### Response Object

| Field | Type | Description |
| :--- | :--- | :--- |
| `contentId` | `string` | Identifier for the content tested. |
| `status` | `string` | `SUCCESS` or `FAIL`. |
| `metrics` | `object` | Performance data (on success). |
| `error` | `object` | Error details (on failure). |

### Metrics Object

| Field | Type | Description |
| :--- | :--- | :--- |
| `startTime` | `string` | ISO8601 Timestamp of test start. |
| `timeToFirstFrameMs` | `number` | Milliseconds until video started playing. |
| `playbackDurationSec` | `number` | Total verified playback duration. |

### Error Object

| Field | Type | Description |
| :--- | :--- | :--- |
| `code` | `string` | `PLAYER_ERROR`, `TIMEOUT`, or `ELEMENT_NOT_FOUND`. |
| `message` | `string` | Human-readable error description. |
| `screenshotPath` | `string` | Path to the failure screenshot. |

**Example Output:**
```json
{
  "contentId": "movie_123",
  "status": "SUCCESS",
  "metrics": {
    "startTime": "2026-03-20T10:00:00Z",
    "timeToFirstFrameMs": 2400,
    "playbackDurationSec": 10.2
  }
}
```
