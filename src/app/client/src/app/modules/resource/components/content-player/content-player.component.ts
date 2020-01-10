
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, PlayerService, CopyContentService, PermissionService, BreadcrumbsService } from '@sunbird/core';
import * as _ from 'lodash';
import { INoteData } from '@sunbird/notes';
import {
  ConfigService, IUserData, ResourceService, ToasterService, WindowScrollService, NavigationHelperService,
  PlayerConfig, ContentData, ContentUtilsServiceService, ITelemetryShare
} from '@sunbird/shared';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput, IFeedbackObject, IFeedbackEdata } from '@sunbird/telemetry';
import { DiscussionModule } from './../../../discussion/discussion.module';
/**
 *Component to play content
 */
@Component({
  selector: 'app-content-player',
  templateUrl: './content-player.component.html',
  styleUrls: ['./content-player.component.scss']
})
export class ContentPlayerComponent implements OnInit {
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;

  closeIntractEdata: IInteractEventEdata;

  objectInteract: IInteractEventObject;

  sharelinkModal: boolean;

  public badgeData: Array<object>;
  /**
   * contains link that can be shared
   */
  shareLink: string;
  /**
   * content id
   */
  contentId: string;

  contentStatus: string;
  /**
   * contains player configuration
   */
  playerConfig: PlayerConfig;
  /**
   * Flag to show player
   */
  showPlayer = false;
  /**
   * Flag to show error
   */
  showError = false;
  /**
   * contain error message
   */
  errorMessage: string;
  /**
   * contain contentData
   */
  contentData: ContentData;
  /**
	 * telemetryShareData
	*/
  telemetryShareData: Array<ITelemetryShare>;
  /**
   * to show loader while copying content
   */
  showCopyLoader = false;
  /**
   * To show/hide the note popup editor
   */
  showNoteEditor = false;
  /**
   * This variable holds the details of the note created
   */
  createNoteData: INoteData;

  showExtContentMsg = false;
  enableDiscussionFeature: string;
  public showRatingModal: Boolean = false;

  public feedbackModal: Boolean = false;
  public telemetryFeedbackObject: IFeedbackObject;
  closeUrl: any;
  //Zoom In/Out Features
  private scaleFactor: number = 0.05;
  private currentSize: number = 0.75;
  constructor(public activatedRoute: ActivatedRoute, public navigationHelperService: NavigationHelperService,
    public userService: UserService, public resourceService: ResourceService, public router: Router,
    public toasterService: ToasterService, public windowScrollService: WindowScrollService, public playerService: PlayerService,
    public copyContentService: CopyContentService, public permissionService: PermissionService,
    public contentUtilsServiceService: ContentUtilsServiceService, public breadcrumbsService: BreadcrumbsService,
    private configService: ConfigService) {
  }
  /**
   *
   * @memberof ContentPlayerComponent
   */
  ngOnInit() {
    this.enableDiscussionFeature = (<HTMLInputElement>document.getElementById('enableDiscussionFeature')).value;
    this.activatedRoute.params.subscribe((params) => {
      this.contentId = params.contentId;
      this.contentStatus = params.contentStatus;
      this.userService.userData$.subscribe(
        (user: IUserData) => {
          if (user && !user.err) {
            this.getContent();
          }
        });
    });
    // window.scrollTo(0, 150);
    $(function () {
      var acc = document.getElementsByClassName("ab-accordion");
      var i;
      for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
          this.classList.toggle("ab-active");
          var panel = this.nextElementSibling;
          if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
          } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
          }
        });
      }
    });
  }
  setTelemetryData() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      object: {
        id: this.contentId,
        type: this.contentData.contentType,
        ver: this.contentData.pkgVersion ? this.contentData.pkgVersion.toString() : '1.0'
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype
      }
    };
    this.closeIntractEdata = {
      id: 'content-close',
      type: 'click',
      pageid: 'content-player'
    };
    this.objectInteract = {
      id: this.contentId,
      type: this.contentData.contentType,
      ver: this.contentData.pkgVersion ? this.contentData.pkgVersion.toString() : '1.0'
    };
    this.telemetryFeedbackObject = {
      id: this.contentId,
      type: 'resource',
      ver: '1.0'
    };
  }
  /**
   * used to fetch content details and player config. On success launches player.
   */
  getContent() {
    const option = { params: this.configService.appConfig.ContentPlayer.contentApiQueryParams };
    if (this.contentStatus && this.contentStatus === 'Unlisted') {
      option.params = { mode: 'edit' };
    }
    this.playerService.getContent(this.contentId, option).subscribe(
      (response) => {
        if (response.result.content.status === 'Live' || response.result.content.status === 'Unlisted') {
          const contentDetails = {
            contentId: this.contentId,
            contentData: response.result.content
          };
          this.playerConfig = this.playerService.getConfig(contentDetails);
          this.contentData = response.result.content;
          if (this.contentData.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.xUrl) {
            setTimeout(() => {
              this.showExtContentMsg = true;
            }, 5000);
          }
          this.setTelemetryData();
          this.showPlayer = true;
          // this.windowScrollService.smoothScroll('content-player');
          this.breadcrumbsService.setBreadcrumbs([{ label: this.contentData.name, url: '' }]);
          this.badgeData = _.get(response, 'result.content.badgeAssertions');
        } else {
          this.toasterService.warning(this.resourceService.messages.imsg.m0027);
          this.close();
        }
      },
      (err) => {
        this.showError = true;
        this.errorMessage = this.resourceService.messages.stmsg.m0009;
      });
  }
  /**
   * retry launching player with same content details
   * @memberof ContentPlayerComponent
   */
  tryAgain() {
    this.showError = false;
    this.getContent();
  }
  /**
   * closes conent player and revert to previous url
   * @memberof ContentPlayerComponent
   */
  close() {
    this.navigationHelperService.navigateToResource('/resources');
  }

  /**
   * This method calls the copy API service
   * @param {contentData} ContentData Content data which will be copied
   */
  copyContent(contentData: ContentData) {
    this.showCopyLoader = true;
    this.copyContentService.copyContent(contentData).subscribe(
      (response) => {
        this.toasterService.success(this.resourceService.messages.smsg.m0042);
        this.showCopyLoader = false;
      },
      (err) => {
        this.showCopyLoader = false;
        this.toasterService.error(this.resourceService.messages.emsg.m0008);
      });
  }
  createEventEmitter(data) {
    this.createNoteData = data;
  }
  public zoomInContentPlayer() {
    //calculating required zoomed-In size
    const zoomedSize = _.round(this.currentSize + this.scaleFactor, 2);
    $('#contentPlayer').css({ 'transform': 'scale(' + zoomedSize + ')' });
    this.currentSize = zoomedSize;
  }

  public zoomOutContentPlayer() {
    //calculating required zoomed-Out size
    const zoomedSize = _.round(this.currentSize - this.scaleFactor, 2);
    $('#contentPlayer').css({ 'transform': 'scale(' + zoomedSize + ')' });
    this.currentSize = zoomedSize;

  }
  onShareLink() {
    this.shareLink = this.contentUtilsServiceService.getPublicShareUrl(this.contentId, this.contentData.mimeType);
    this.setTelemetryShareData(this.contentData);
  }
  setTelemetryShareData(param) {
    this.telemetryShareData = [{
      id: param.identifier,
      type: param.contentType,
      ver: param.pkgVersion ? param.pkgVersion.toString() : '1.0'
    }];
  }
  public contentProgressEvent(event) {
    console.log('Event==========>', event);
    const eid = event.detail.telemetryData.eid;
    if (eid === 'END') {
      this.showRatingModal = true;
    }
  }
}
