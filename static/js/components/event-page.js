import React from 'react';
import client from '../api';

export default class EventPage extends React.Component {
    constructor(props) {
        super(props);

        this.exportEvent = this.exportEvent.bind(this);
    }
    exportEvent() {
        // Retrieves event information and returns as ical file
        let eventID = this.props.event.id;
        client.get('/export/' + eventID)
        .then(res => {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(res.data));
            element.setAttribute('download', "calendar_event.ics");
            element.style.display = 'none';
            document.body.appendChild(element);
            // Autmoatically downloads ical file
            element.click();
            document.body.removeChild(element);
        })
        .catch(err => {
            console.error(err);
        })
    }

    render() {
        var category = this.props.event.category.pop();

        function dateToString(date) {
            let hours = date.getHours();
            let minutes = ('0' + date.getMinutes()).slice(-2);
            return (hours + ':' + minutes);
        }

        return (
            <div class="Event">
              <div class="Event__width">
                <button class="Event__button" onClick={this.props.returnToCalendar}>
                  <span class="Event__button__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 8 8 12 12 16"></polyline>
                      <line x1="16" y1="12" x2="8" y2="12"></line>
                    </svg>
                  </span>
                  <span class="Event__button__text">
                    Back to Calendar
                  </span>
                </button>

                <section class="Event__content">
                  <h2 class="Event__content__title">
                    {this.props.event.title}
                  </h2>

                  <div class="Event__content__block">
                    <span data-tag={category} class="Event__content__tag">
                      {category === "pgp" ? "PGP" : category.replace("_", " ")}
                    </span>
                  </div>

                  <table class="Event__content__table">
                    <tr class="Event__content__table__row">
                      <td class="Event__content__headers">
                        Hosted by
                      </td>
                      <td class="Event__content__text">
                        <span class="Event__content__date">
                          {this.props.event.host_name}
                        </span>
                        |
                        <a class="Event__content__text__link" href={"mailto:" + this.props.event.host_email}>
                          {this.props.event.host_email}
                        </a>
                      </td>
                    </tr>

                    <tr class="Event__content__table__row">
                      <td class="Event__content__headers">
                        When?
                      </td>
                      <td class="Event__content__text">
                        <span class="Event__content__date">
                          {this.props.event.start.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        |
                        <span class="Event__content__time">
                          {dateToString(this.props.event.start)}
                        </span>
                        <span class="Event__content__time">
                          {dateToString(this.props.event.end)}
                        </span>
                      </td>
                    </tr>

                    <tr class="Event__content__table__row">
                      <td class="Event__content__headers">
                        Where?
                      </td>
                      <td class="Event__content__text">
                        {this.props.event.location}
                      </td>
                    </tr>

                    <tr class="Event__content__table__row">
                      <td class="Event__content__headers">
                        What?
                      </td>
                      <td class="Event__content__text">
                        <details>
                          <summary>
                            Click here to show the details!
                          </summary>
                          <div dangerouslySetInnerHTML={{__html: this.props.event.description.replace(/\<br\>/, '')}}>
                          </div>
                        </details>
                      </td>
                    </tr>
                  </table>

                  <div class="Event__export">
                    <input type="email" class="Event__export__field" placeholder="franklin.olin@olin.edu"/>
                    <button class="Event__export__button" onClick={this.exportEvent}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      <span>Send me an iCal</span>
                    </button>
                  </div>
                </section>
              </div>
            </div>
        )
    }
}
