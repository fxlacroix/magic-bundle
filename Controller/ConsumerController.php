<?php

namespace FXL\Bundle\MagicBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;


/**
 * @Route("/consume")
 *
 */
class ConsumerController extends Controller
{
    /**
     * @Route("/")
     * @Template()
     */
    public function indexAction()
    {
        return array();
    }

    /**
     * @Route("/{consumer}/search/{term}")
     * @Template()
     */
    public function searchAction($consumer, $term)
    {
        $wikipediaConsumer = $this->get('fxl_component.consumer.wikipedia');

        $searchList = $wikipediaConsumer->search($term);

        return new JsonResponse($searchList);
    }

    /**
     * @Route("/{consumer}/find/{term}")
     * @Template()
     */
    public function findAction($term)
    {
        $wikipediaConsumer = $this->get('fxl_component.consumer.wikipedia');
        $googleImageConsumer = $this->get('fxl_component.consumer.google.image');

        $imageList = $googleImageConsumer->find($term);
        $searchList = $wikipediaConsumer->find($term);

        $searchList->images = $imageList;

        return new JsonResponse($searchList);
    }
}
