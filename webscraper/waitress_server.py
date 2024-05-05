import app
from waitress import serve
import logging

logger = logging.getLogger('waitress')
logger.setLevel(logging.INFO)

serve(app.app, host='127.0.0.1', port=5000)