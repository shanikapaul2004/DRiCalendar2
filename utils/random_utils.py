import logging
import requests

from DRICALENDAR2.utils.logger import configure_logger

logger = logging.getLogger(__name__)
configure_logger(logger)


def get_random() -> float:
    url = "https://zenquotes.io/api/random"

    try:
        # Log the request to random.org
        logger.info("Fetching an affirmation from %s", url)

        response = requests.get(url, timeout=5)

        # Check if the request was successful
        response.raise_for_status()

        random_number_str = response.text.strip()

        try:
            random_number = float(random_number_str)
        except ValueError:
            raise ValueError("Invalid response from zenquote.io: %s" % random_number_str)

        logger.info("Received affirmation: %.3f", random_number)
        return random_number

    except requests.exceptions.Timeout:
        logger.error("Request to zenquotes.io timed out.")
        raise RuntimeError("Request to zenquotes.io timed out.")

    except requests.exceptions.RequestException as e:
        logger.error("Request to zenquotes.io failed: %s", e)
        raise RuntimeError("Request to zenquotes.io failed: %s" % e)