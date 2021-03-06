import os
import sys

from google.appengine.dist import use_library
use_library('django', '1.2')

sys.path.insert(0, os.path.join(os.path.abspath(os.path.dirname(__file__)), 'third_party'))

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

import handlers.checkins
import handlers.main
import handlers.session

def main():
  application = webapp.WSGIApplication([
          # main
          ('/', handlers.main.IndexHandler),

          # session and users
          ('/4sq/connect', handlers.session.FoursquareConnectHandler),
          ('/4sq/callback', handlers.session.FoursquareCallbackHandler),
          ('/sign-out', handlers.session.SignOutHandler),
          ('/toggle-email', handlers.session.ToggleEmailHandler),

          # data fetching
          ('/checkins/update', handlers.checkins.UpdateCheckinsHandler),
          ('/checkins/update/state', handlers.checkins.UpdateCheckinsStateHandler),
          ('/checkins/clear', handlers.checkins.ClearCheckinsHandler),

          # Intersects
          ('/checkins/intersect', handlers.checkins.IntersectCheckinsHandler),
          ('/checkins/intersect/data', handlers.checkins.IntersectCheckinsDataHandler),
          ('/checkins/intersect/recent', handlers.checkins.RecentIntersectionsHandler),
          ('/i/(.+)', handlers.checkins.ShortIntersectHandler),
          ('/q/(.+)', handlers.checkins.QrCodeIntersectHandler),
      ],
      debug=True)
  util.run_wsgi_app(application)

if __name__ == '__main__':
  main()
