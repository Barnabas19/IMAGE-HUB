var home = require('../../controllers/home');
var image = require('../../controllers/image');
var routes = require('../../server/routes');


describe('Routes', function(){
    var app = {    //THIS IS MORE LIKE A FAKE...TO MIMIC THE ACTUAL THING - 'app' IN server/routes.js
        get: sinon.spy(), //SPY ONLY REQUIRES THAT YOU USE THE NAME OF THE ACTUAL THING...IT WILL TRACK IT AND SPY ON IT TO ASSERT(through chai.js) THAT IT ACTUALLY RUNS
        post: sinon.spy(),
        delete: sinon.spy(),
    };
    beforeEach(function(){  //WILL HAPPEN BEFORE EVERY it() ASSERTION NOT BEFORE EVERY describe() SUITE
        routes.initialize(app);
    });

    //TEST GET ENDPOINTS
    describe('GETs', function(){
        it('should handle /', function(){
            expect(app.get).to.be.calledWith('/', home.index);  //EXPECT THE ACTUAL THING TO... OR TO BE CALLED WITH...
        });
        it('should handle /images/:image_id', function(){
            expect(app.get).to.be.calledWith('/images/:image_id', image.index);   //EXPECT THE ACTUAL THING TO... OR TO BE CALLED WITH...
        })
    });

    //TEST POST ENDPOINTS
    describe('POSTs', function(){
        it('should handle /images', function(){
            expect(app.post).to.be.calledWith('/images', image.create);
        });
        it('should handle /images/:image_id/like', function(){
            expect(app.post).to.be.calledWith('/images/:image_id/like', image.like);
        });
        it('should handle /images/:image_id/comment', function(){
            expect(app.post).to.be.calledWith('/images/:image_id/comment', image.comment);
        });
    });

    //TEST DELETE ENDPOINTS
    describe('DELETEs', function(){
        it('should handle /images/:image_id', function(){
            expect(app.delete).to.be.calledWith('/images/:image_id', image.remove);
        })
    })
});
