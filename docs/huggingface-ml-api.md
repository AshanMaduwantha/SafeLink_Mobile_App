# HuggingFace ML API (Gradio) — Mobile integration notes

The mobile app calls the HuggingFace Space using Gradio's HTTP API from `src/screens/live-stream/LiveStreamScreen.tsx`.

## Required Space settings (important)

Your current Space UI works because Gradio's frontend talks to internal queue endpoints, but **named endpoints** like:

- `/gradio_api/call/predict_image`
- `/gradio_api/call/predict_video`

only work reliably if you **expose an `api_name`** and (for queued calls) **enable Gradio queue**.

## Recommended Space change (app.py)

Update your `.click()` handlers to include `api_name`, and enable `queue()`:

```python
btn_img.click(
    fn=predict_image,
    inputs=[in_img, conf, iou, max_det, classes],
    outputs=[out_img, out_txt],
    api_name="predict_image",
)

btn_vid.click(
    fn=predict_video,
    inputs=[in_vid, conf, iou, max_det, classes],
    outputs=[out_vid, out_vid_txt],
    api_name="predict_video",
)

demo.queue()
```

Then deploy the Space.

## Mobile app config

Set `ML_API_URL` in the app `.env` (example):

```
ML_API_URL=https://your-space-name.hf.space
```

Then rebuild the native app so `react-native-config` picks it up.


