from PIL import Image, ImageEnhance, ImageFilter
import io

def preprocess_image(image_bytes: bytes) -> bytes:
    """Enhance image for better OCR accuracy"""
    image = Image.open(io.BytesIO(image_bytes))

    # Convert to grayscale
    image = image.convert('L')

    # Enhance contrast
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2.0)

    # Sharpen
    image = image.filter(ImageFilter.SHARPEN)

    # Scale up
    new_width = image.width * 2
    new_height = image.height * 2
    image = image.resize((new_width, new_height), Image.LANCZOS)

    output = io.BytesIO()
    image.save(output, format='PNG')
    return output.getvalue()